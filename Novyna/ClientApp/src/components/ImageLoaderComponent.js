import React, { Component } from 'react';

export class ImageLoaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: this.props.images,
            coverindex: this.props.coverindex,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            images: nextProps.images,
            coverindex: nextProps.coverindex,
        });
    }

    render() {
        const selectedImages = this.state.images.map((img, index) => {
            var imageClasses = "rounded";
            if (index === this.state.coverindex) {
                imageClasses += " border border-primary border-4";
            }

            return (
                <div class="container" >
                    <div class="row">
                        <div class="col-auto">
                            <div class="position-relative">
                                <img src={img.fileUrl} style={{ width: 100, height: 100 }} class={imageClasses} onClick={() => this.onImageClickHandler(index)} />
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">{index}</span>
                            </div>
                        </div>
                        <div class="col-auto p-0 d-flex align-items-center">
                            <a class="btn btn-link p-0" onClick={() => this.deleteImage(img)}><i class="bi bi-x-circle align-middle"></i></a>
                        </div>
                    </div>
                </div>);
        }
        );
        var selectCoverImageCaption = selectedImages.length > 0 ? (<label class="form-label">Select image for cover page</label>) : '';
        return (
            <>
                <div class="mb-3">
                    <label class="form-label">Select image</label>
                    <input class="form-control" type="file" name="image" onChange={(e) => this.onChangeHandler(e.target.files[0])} />
                </div>
                <div>
                    {selectCoverImageCaption}
                </div>
                <div class="d-flex flex-row">
                    {selectedImages}
                </div>
            </>
        );
    }

    onImageClickHandler(value) {

        var newState = {
            coverindex: value,
            images: this.state.images
        };
        this.setState(newState);
        this.onSelectedCoverStateChanged(value);
    }

    async onChangeHandler(value) {
        const formData = new FormData();
        formData.append('image', value);
        let res = await fetch("api/images", {
            method: "POST",
            body: formData,
        });
        let resJson = await res.json();

        var images = [
            ...this.state.images,
            resJson
        ];
        var newState = {
            images: images,
            coverindex: this.state.coverindex
        };
        this.setState(newState);
        this.onImageArrayStateChanged(images);
    }

    onImageArrayStateChanged(images) {
        if (this.props.onImagesChanged != null) {
            this.props.onImagesChanged(images);
        }
    }

    onSelectedCoverStateChanged(coverindex) {
        if (this.props.onImageSelected != null) {
            this.props.onImageSelected(coverindex);
        }
    }

    async deleteImage(img) {
        const result = await fetch('api/images/' + img.id, {
            method: 'DELETE',
        });
        const images = [
            ...this.state.images.filter(i => i.id !== img.id)
        ];
        var newState = {
            images: [
                ...images
            ],
            coverindex: this.state.coverindex
        };
        this.setState(newState);

        this.onImageArrayStateChanged(images)
    }
}
