import React, { Component } from 'react'
import NewsItem from './NewsItem'
import axios from "axios";
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {

    static defaultProps = {
        country: 'in',
        pageSize: 6,
        category: 'general'
    }

    static propsTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props) {
        super(props);
        this.state = { articles: [], loading: true, page: 1, totalResults: 0 }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsApp`
    }

    async updateNews() {
        this.props.setProgress(20);
        this.setState({ loading: true });
        let response = await axios.get(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}`);
        //console.log(response.data);
        this.props.setProgress(60);
        this.setState({ articles: response.data.articles, totalResults: response.data.totalResults, loading: false });
        this.props.setProgress(100);
    }

    async componentDidMount() {
        this.updateNews();
    }

    // handlePrevClick = async () => {
    //     console.log('prev')
    //     this.setState({ page: this.state.page - 1 });
    //     this.updateNews();
    // }

    // handleNextClick = async () => {
    //     if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {
    //         this.setState({ loading: true });
    //         let response = await axios.get(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`);
    //         //console.log(response.data);
    //         this.setState({ page: this.state.page + 1, articles: response.data.articles, loading: false });
    //     }
    // }

    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 });
        let response = await axios.get(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`);
        //console.log(response.data);
        this.setState({ articles: this.state.articles.concat(response.data.articles), totalResults: response.data.totalResults });
    };

    render() {
        return (
            <>
                <h2 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>DailyNews - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
                {this.state.loading === true && <Spinner />}

                <InfiniteScroll dataLength={this.state.articles.length} next={this.fetchMoreData} hasMore={this.state.articles.length !== this.state.totalResults} loader={<Spinner />}>
                    <div className="container">
                        <div className="row">
                            {(this.state.loading !== true) && this.state.articles.map((ele, i) => {
                                return (<div key={i} className="col-md-3">
                                    <NewsItem title={(ele.title !== null) ? ele.title.slice(0, 25) : ''} description={(ele.description !== null) ? ele.description.slice(0, 50) : ''} imageUrl={(ele.urlToImage !== null) ? ele.urlToImage : "https://images.hindustantimes.com/tech/img/2023/05/15/cropped/16-9/eagle_nebula_1684135473916_1684135478737.jpg?impolicy=new-ht-20210112&width=1600"} newsUrl={ele.url} date={ele.publishedAt} source={ele.source.name} />
                                </div>)
                            })}
                        </div>
                    </div>
                </InfiniteScroll>

                {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-sm btn-dark m-1" onClick={this.handlePrevClick}>&larr; Previous Page</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-sm btn-dark m-1" onClick={this.handleNextClick}>Next Page &rarr; </button>
                </div> */}
            </>
        )
    }
}

export default News
