import React, { Component } from 'react';
import { TagEditorDialog } from './TagEditorDialog';


export class TagPanel extends Component {
    static defaultTagTemplate = {
        "name": "New tag",
        "color": "#0000ff"
    };

    constructor(props) {
        super(props);

        this.state = {
            tags: [],
            forEditing: TagPanel.defaultTagTemplate,
            selectedTag: null
        };

        this.populateTags = this.populateTags.bind(this);
    }

    componentDidMount() {
        this.populateTags();
    }

    render() {
        let listContent = null;
        if (this.state.tags.length === 0) {
            listContent = <p>...</p>
        }
        else {
            const tagList = this.state.tags.map(t => {
                const selectedBorder = t.id == this.state.selectedTag?.id == true ? "rounded border border-4 border-primary m-2" : "m-2";
                return (<tr key={t.id} class={ selectedBorder } onClick={() => this.selectTagHandler(t)}>
                        <td class="align-middle" style={{ color: t.color }}><i class="bi bi-bookmark-fill px-2"></i></td>
                        <td class="align-middle">{t.name}</td>
                        <td><a class="btn btn-link" onClick={(e) => this.editTag(e,t)}><i class="bi bi-pencil-square"></i></a></td>
                        <td><a class="btn btn-link" onClick={(e) => this.deleteTag(e,t.id)}><i class="bi bi-x-circle"></i></a></td>
                    </tr>)
            });
            listContent = <table class="table table-sm"><tbody>{tagList}</tbody></table>
        }

        return (
            <div class="container">
                <h1 class="display-6"><i class="bi bi-bookmarks"></i>Tags</h1>
                <hr class="border border-primary border-1" />
                <button type="button" class="btn btn-outline-dark" onClick={() => this.createTag()}><i class="bi bi-plus-circle px-2"></i>Add tag</button>
                <hr class="border border-primary border-1" />
                {listContent}
                <TagEditorDialog onSave={this.populateTags} tag={this.state.forEditing} />
            </div>
        );
    }

    async populateTags() {
        const response = await fetch('api/tags', {
            method: "GET",
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        this.setState(
            {
                tags: data,
                forEditing: TagPanel.defaultTagTemplate,
                selectedTag: null
            });
    }

    async deleteTag(e, tagId) {
        e.stopPropagation();
        const response = await fetch('api/tags/' + tagId, {
            method: "DELETE"
        }
        );
        await this.populateTags();
    }

    editTag(e, tag) {
        e.stopPropagation();
        this.setState({
            tags: this.state.tags,
            forEditing: tag,
            selectedTag: this.state.selectedTag
        })

        const modal = new window.bootstrap.Modal(document.getElementById('tagEditorModal'));
        modal.show();
    }

    createTag() {
        this.setState({
            tags: this.state.tags,
            forEditing: TagPanel.defaultTagTemplate,
            selectedTag: this.state.selectedTag
        })

        const modal = new window.bootstrap.Modal(document.getElementById('tagEditorModal'));
        modal.show();
    }

    selectTagHandler(t) {

        const newState = this.state.selectedTag == null
            ? t
            : this.state.selectedTag.name == t.name
                ? null
                : t;
        this.setState({
            tags: this.state.tags,
            forEditing: TagPanel.defaultTagTemplate,
            selectedTag: newState
        });

        if (this.props.onTagSelected != null) {
            this.props.onTagSelected(newState);
        }
    }
}