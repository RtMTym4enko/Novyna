import React, { Component } from 'react';

export class AssignedTagsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: this.props.tags,
            availableTags: []
        };
    }

    componentDidMount() {
        this.populateTags();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            tags: nextProps.tags
        });
        this.populateTags();
    }

    render() {
        const defaultValue = '';
        const selectedTags = this.state.tags.map(t => {
            return (
                <div class="d-inline-flex border p-1">
                    <div class="row">
                        <div class="col-auto align-self-center" style={{ color: t.color }}>
                            <i class="bi bi-bookmark-fill px-2"></i>
                        </div>
                        <div class="col align-self-center">
                            <span>{t.name}</span>
                        </div>
                        <div class="col-auto">
                            <a class="btn btn-link" onClick={() => this.deleteTag(t)}><i class="bi bi-x-circle"></i></a>
                        </div>
                    </div>
                </div>
            );
        }
        );
        var options = this.state.availableTags.map(t => (<option class="pb-1" value={t.id}>{t.name}</option>));
        return (
            <>
                <div class="mb-3">
                    <label class="form-label">Assign tag</label>
                    <select class="form-select" value={defaultValue} onChange={(e) => this.tagAssigned(e.target.value)}>
                        <option class="py-1">SelectTag</option>
                        {options}
                    </select>
                </div>

                <div class="d-inline-flex flex-wrap">
                    {selectedTags}
                </div>
            </>
        );
    }

    tagAssigned(tagId) {
        if (tagId === null) {
            return;
        }
        var tag = this.state.availableTags.filter(t => t.id === tagId)[0];
        var availableStates = this.state.availableTags.filter(t => t.id !== tag.id);
        var newState = {
            availableTags: availableStates,
            tags: [
                ...this.state.tags,
                tag
            ]
        };
        this.setState(newState);
        this.onStateChanged(newState.tags);
    }

    deleteTag(tag) {
        var newState = {
            tags: [
                ...this.state.tags.filter(t => t.id !== tag.id)
            ],
            availableTags: [
                ...this.state.availableTags,
                tag
            ]
        };
        this.setState(newState);
        this.onStateChanged(newState.tags);
    }

    async populateTags() {
        const response = await fetch('api/tags', {
            method: "GET",
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        this.setState({
            tags: this.state.tags,
            availableTags: data.filter(t => !this.state.tags.some(tt => tt.id === t.id))
        });
    }

    onStateChanged(state) {
        if (this.props.onTagsChanged != null) {
            this.props.onTagsChanged(state);
        }
    }
}
