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
            selectedTag: TagPanel.defaultTagTemplate
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
            const tagList = this.state.tags.map(t => (
                <tr key={t.id}>
                    <td class="align-middle" style={{ color: t.color }}><i class="bi bi-bookmark-fill px-2"></i></td>
                    <td class="align-middle">{t.name}</td>
                    <td><a class="btn btn-link" onClick={() => this.editTag(t)}><i class="bi bi-pencil-square"></i></a></td>
                    <td><a class="btn btn-link" onClick={() => this.deleteTag(t.id)}><i class="bi bi-x-circle"></i></a></td>
                </tr>));
            listContent = <table class="table table-sm"><tbody>{tagList}</tbody></table>
        }

        return (
            <div class="container">
                <h1 class="display-6"><i class="bi bi-bookmarks"></i>Tags</h1>
                <hr class="border border-primary border-1" />
                <button type="button" class="btn btn-outline-dark" onClick={() => this.createTag()}><i class="bi bi-plus-circle px-2"></i>Add tag</button>
                <hr class="border border-primary border-1" />
                {listContent}
                <TagEditorDialog onSave={this.populateTags} tag={this.state.selectedTag} />
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
                selectedTag: TagPanel.defaultTagTemplate
            });
    }

    async deleteTag(tagId) {
        const response = await fetch('api/tags/' + tagId, {
            method: "DELETE"
        }
        );
        await this.populateTags();
    }

    editTag(tag) {
        this.setState({
            tags: this.state.tags,
            selectedTag: tag
        })

        const modal = new window.bootstrap.Modal(document.getElementById('tagEditorModal'));
        modal.show();
    }

    createTag() {
        this.setState({
            tags: this.state.tags,
            selectedTag: TagPanel.defaultTagTemplate
        })

        const modal = new window.bootstrap.Modal(document.getElementById('tagEditorModal'));
        modal.show();
    }
}