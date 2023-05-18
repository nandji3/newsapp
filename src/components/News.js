import React, { Component } from 'react'
import NewsItem from './NewsItem'
import axios from "axios";
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 5,
        category: 'general'
    }
    static propsTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }
    constructor() {
        super();
        console.log("Hello! I am a constructor from news component");
        this.state = { articles: [], loading: false, page: 1 }
    }

    async updateNews() {
        this.setState({ loading: true });
        let response = await axios.get(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=6c36eff2ad23476f959093cdadc8c831&page=1&pageSize=${this.props.pageSize}`);
        //console.log(response.data);
        this.setState(({ articles: response.data.articles, totalResults: response.data.totalResults, loading: false }));
    }

    async componentDidMount() {
        this.updateNews();
    }

    handlePrevClick = async () => {

        this.setState({ page: this.state.page - 1 });
        this.updateNews();
    }

    handleNextClick = async () => {
        // if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)))

        this.setState({ page: this.state.page + 1 });
        this.updateNews();
    }

    render() {
        return (
            <div className='container my-3'>
                <h2 className='text-center' style={{ margine: '35px 0px' }}>NewsMonkey - Top Headlines</h2>
                <div >{this.state.loading === true && <Spinner />}</div>
                <div className="row">

                    {(this.state.loading !== true) && this.state.articles.map((ele) => {
                        return <div key={ele.url} className="col-md-3">
                            <NewsItem title={(ele.title !== null) ? ele.title.slice(0, 50) : ''} description={(ele.description !== null) ? ele.description.slice(0, 85) : ''} imageUrl={(ele.urlToImage !== null) ? ele.urlToImage : "https://images.hindustantimes.com/tech/img/2023/05/15/cropped/16-9/eagle_nebula_1684135473916_1684135478737.jpg?impolicy=new-ht-20210112&width=1600"} newsUrl={ele.url} author={ele.author} date={ele.publishedAt} source={ele.source.name} />

                        </div>
                    })}

                </div>
                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-sm btn-dark m-1" onClick={this.handlePrevClick}>&larr; Previous Page</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-sm btn-dark m-1" onClick={this.handleNextClick}>Next Page &rarr; </button>
                </div>
            </div>
        )
    }
}

export default News
