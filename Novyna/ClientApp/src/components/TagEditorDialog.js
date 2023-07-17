import React, { Component } from 'react';

export class TagEditorDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tagState: this.props.tag
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ tagState: nextProps.tag })
    }

    render() {
        const saveTagAction = async () => {
            if (this.state.tagState.id == null) {
                const result = await fetch('api/tags', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.tagState)
                })
            }
            else {
                const result = await fetch('api/tags/' + this.state.tagState.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.tagState)
                })
            }
            if (this.props.onSave != null) {
                this.props.onSave();
            }
        }

        const NameChangeHandler = (e) => {
            this.setState({
                tagState: {
                    ...this.state.tagState,
                    name: e.target.value
                }
            });
        }

        const ColorChangeHandler = (e) => {
            this.setState({
                tagState: {
                    ...this.state.tagState,
                    color: e.target.value
                }
            });
        }
        const title = this.state.tagState.id == null ? "Create tag" : "Edit tag";
        const isSaveDisabled = !(this.state.tagState.name && this.state.tagState.color)
        return (
            <div class="modal" id="tagEditorModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="tagEditorDialogLabel">{title}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label class="form-label">Name</label>
                                    <input type="text" class="form-control" value={this.state.tagState.name} onChange={NameChangeHandler} />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Color</label>
                                    <input type="color" class="form-control form-control-color" onChange={ColorChangeHandler} value={this.state.tagState.color} title="Choose your color" />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary" disabled={isSaveDisabled} data-bs-dismiss="modal" onClick={saveTagAction}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}