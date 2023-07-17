import React, { Component } from 'react';
import { NewsEditorDialog } from './NewsEditorDialog';

export class NewsPanel extends Component {
    static defaultNewsTemplate = {
        "title": "New hot news",
        "content": "",
        "coverindex": -1,
        "images": [],
        "tags": []
    };

    constructor(props) {
        super(props);

        this.state = {
            news: [],
            selectedNews: NewsPanel.defaultNewsTemplate
        };

        this.populateNews = this.populateNews.bind(this);
    }

    componentDidMount() {
        this.populateNews();
    }
    render() {
        let listContent = null;
        if (this.state.news.length === 0) {
            listContent = <p>Loading...</p>
        }
        else {
            listContent = this.state.news.map(n => {
                const imageUrl = n.images.length >= n.coverIndex && n.coverIndex < n.images.length ? n.images[n.coverIndex].fileUrl : '';
                return(
                    <div class="card mb-3">
                        <img src={imageUrl} style={{ height: 300 }} class="card-img-top object-fit-contain" />
                        <div class="card-body">
                            <h5 class="card-title">{n.title}
                                <a class="btn btn-link" onClick={() => this.editNews(n)}><i class="bi bi-pencil-square"></i></a>
                                <a class="btn btn-link" onClick={() => this.deleteNews(n.id)}><i class="bi bi-x-circle"></i></a>
                            </h5>
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-secondary" type="button">Read</button>
                            </div>
                            <p class="card-text">{n.content}</p>
                        </div>
                    </div>);
            });
        }

        return (
            <div className="container">
                <h1 class="display-6">News</h1>
                <hr class="border border-primary border-1" />
                <button type="button" class="btn btn-outline-dark" onClick={() => this.createNews()}><i class="bi bi-send-plus px-2"></i>Add news</button>
                <hr class="border border-primary border-1" />
                {listContent}
                <NewsEditorDialog onSave={this.populateNews} news={this.state.selectedNews} />
            </div>
        );
    }

    async populateNews() {
        const response = await fetch('api/news', {
            method: "GET",
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        this.setState({ news: data, selectedNews: NewsPanel.defaultNewsTemplate});
    }

    async deleteNews(newsId) {
        const response = await fetch('api/news/' + newsId, {
            method: "DELETE"
        }
        );
        await this.populateNews();
    }

    editNews(news) {
        this.setState({
            news: this.state.news,
            selectedNews: {
                ...news
            }
        })

        const modal = new window.bootstrap.Modal(document.getElementById('newsEditorModal'));
        modal.show();
    }

    createNews() {
        this.setState({
            news: this.state.news,
            selectedNews: NewsPanel.defaultNewsTemplate
        })

        const modal = new window.bootstrap.Modal(document.getElementById('newsEditorModal'));
        modal.show();
    }
}