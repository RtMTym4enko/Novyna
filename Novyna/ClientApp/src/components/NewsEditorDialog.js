import React, { Component } from 'react';
import { AssignedTagsComponent } from './AssignedTagsComponent';
import { ImageLoaderComponent } from './ImageLoaderComponent';

export class NewsEditorDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            newsState: this.props.news,
        };

        this.onImagesChanged = this.onImagesChanged.bind(this);
        this.onImageSelected = this.onImageSelected.bind(this);
        this.onTagsChanged = this.onTagsChanged.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            newsState: nextProps.news,
        });
    }

    render() {
        const saveNewsAction = async () => {
            if (this.state.newsState.id == null) {
                const result = await fetch('api/news', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.newsState)
                })
            }
            else {
                const result = await fetch('api/news/' + this.state.newsState.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.newsState)
                })
            }
            if (this.props.onSave != null) {
                this.props.onSave();
            }
        }

        const TitleChangeHandler = (e) => {
            this.setState({
                newsState: {
                    ...this.state.newsState,
                    title: e.target.value
                }
            });
        }

        const ContentChangeHandler = (e) => {
            this.setState({
                newsState: {
                    ...this.state.newsState,
                    content: e.target.value
                }
            });
        }
        const isSaveButtonDisabled = !(this.state.newsState.title
            && this.state.newsState.content
            && this.state.newsState.coverindex >= 0
            && this.state.newsState.tags
            && this.state.newsState.tags.length > 0
            && this.state.newsState.images
            && this.state.newsState.images.length > 0);

        const title = this.state.newsState.id == null ? "Create news" : "Edit news"

        return (
            <div class="modal" id="newsEditorModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="tagEditorDialogLabel">{title}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="py-2">
                                    <label class="form-label">Title</label>
                                    <input type="text" class="form-control" value={this.state.newsState.title} onChange={TitleChangeHandler} />
                                </div>
                                <div class="py-2">
                                    <label class="form-label">Content</label>
                                    <textarea class="form-control" rows="5" value={this.state.newsState.content} onChange={ContentChangeHandler}></textarea>
                                </div>
                                <div class="py-2">
                                    <ImageLoaderComponent onImageSelected={this.onImageSelected} onImagesChanged={this.onImagesChanged}
                                        coverindex={this.state.newsState.coverindex}
                                        images={this.state.newsState.images} />
                                </div>
                                <div class="py-2">
                                    <AssignedTagsComponent onTagsChanged={this.onTagsChanged} tags={this.state.newsState.tags} />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" disabled={isSaveButtonDisabled} class="btn btn-primary" data-bs-dismiss="modal" onClick={saveNewsAction}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onTagsChanged = (e) => {
        this.setState({
            newsState: {
                ...this.state.newsState,
                tags: e
            }
        });
    }


    onImageSelected = (e) => {
        this.setState({
            newsState: {
                ...this.state.newsState,
                coverindex: e
            }
        });
    }

    onImagesChanged = (e) => {
        this.setState({
            newsState: {
                ...this.state.newsState,
                images: e
            }
        });
    }
}