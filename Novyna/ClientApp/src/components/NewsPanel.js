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
            selectedNews: NewsPanel.defaultNewsTemplate,
            newsCardState: [],
            selectedTag: this.props.selectedTag
        };

        this.populateNews = this.populateNews.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            ... this.state,
            selectedTag: nextProps.selectedTag
        }
        this.populateNews();
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
            listContent = this.state.news.map((n, newsIndex) => {
                const generatedContent = this.generateContent(n);
                const imageUrl = n.images.length >= n.coverIndex && n.coverIndex < n.images.length ? n.images[n.coverIndex].fileUrl : '';
                const showContent = this.state.newsCardState[newsIndex] == "open"; 
                const content = showContent && <p class="card-text">{generatedContent}</p>
                const buttonContent = showContent
                    ? (<><i class="bi bi-chevron-compact-up"></i><span style={{ marginLeft: 20, marginRight: 20 }}>Hide</span><i class="bi bi-chevron-compact-up"></i></>)
                    : (<><i class="bi bi-chevron-compact-down"></i><span style={{ marginLeft: 20, marginRight: 20 }}>Read</span><i class="bi bi-chevron-compact-down"></i></>);
                const buttonContainerClasses = showContent ? "text-end" : "d-grid"
                return (
                    <div class="card mb-3">
                        <img src={imageUrl} style={{ height: 300 }} class="card-img-top object-fit-contain" />
                        <div class="card-body">
                            <h5 class="card-title">{n.title}
                                <a class="btn btn-link" onClick={() => this.editNews(n)}><i class="bi bi-pencil-square"></i></a>
                                <a class="btn btn-link" onClick={() => this.deleteNews(n.id)}><i class="bi bi-x-circle"></i></a>
                            </h5>
                            <div class={buttonContainerClasses}>
                                <button class="btn btn-outline-secondary" type="button" onClick={() => this.showContentHandler(newsIndex)} >
                                    {buttonContent}
                                </button>
                            </div>
                            {content}
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
    generateContent(news) {
        let content = [];
        const regexp = /{\d+}/g;
        var matches = news.content.matchAll(regexp);
        var startIndex = 0;
        var endIndex = 0;
        for (const match of matches) {
            endIndex = match.index;
            content.push(<p>{news.content.substring(startIndex, endIndex)}</p>);
            var imgIndex = parseInt(match[0].substring(1, match[0].length - 1));
            var imgHref = imgIndex >= 0 && imgIndex < news.images.length ? news.images[imgIndex].fileUrl : '';
            content.push(<div class="text-center"><img src={imgHref} style={{ height: 300 }} /></div>)
            startIndex = endIndex + match[0].length;
        }
        content.push(<p>{news.content.substring(startIndex)}</p>);
        return content.length == 0 ? news.content : content;
    }

    showContentHandler(index) {
        this.state.newsCardState[index] = this.state.newsCardState[index] == "closed" ? "open" : "closed";
        this.setState(
            {
                ...this.setState
            }
        );
    }

    async populateNews() {
        const uri = this.state.selectedTag == null ? 'api/news' : 'api/news?tags=' + encodeURIComponent(this.state.selectedTag.name);
        const response = await fetch(uri, {
            method: "GET",
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        this.setState({
            news: data,
            selectedNews: NewsPanel.defaultNewsTemplate,
            newsCardState: data.map(d => "closed"),
            selectedTag: this.state.selectedTag
        });
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
            ... this.state,
            selectedNews: {
                ...news
            }
        })

        const modal = new window.bootstrap.Modal(document.getElementById('newsEditorModal'));
        modal.show();
    }

    createNews() {
        this.setState({
            ... this.state,
            selectedNews: NewsPanel.defaultNewsTemplate,
        })

        const modal = new window.bootstrap.Modal(document.getElementById('newsEditorModal'));
        modal.show();
    }

}