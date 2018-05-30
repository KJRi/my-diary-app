// @flow
import React from 'react'
import './Home.css'
import { Input } from 'antd'
import PostPage from 'components/PostPage'
const Search = Input.Search

type Props = {}
type State = {
  postlist: Array<Object>
}

class Home extends React.PureComponent<Props, State> {
  searchPst: Function
  constructor (props: Props) {
    super(props)
    this.state = {
      postlist: []
    }
    this.searchPst = this.searchPst.bind(this)
  }
  searchPst (value) {
    const evalue = value.trim()
    fetch(`/post/get?title=${evalue}`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        postlist: res
      })
    })
  }
  componentWillMount () {
    const username = localStorage.getItem('username')
    fetch(`/diary/get?author=${username}`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        postlist: res
      })
    })
  }
  render () {
    const postlist = this.state.postlist
    console.log(postlist)
    return (
      <div>
        <Search
          placeholder='请输入您想搜索的帖子'
          onSearch={this.searchPst}
          size='large'
        />
        <PostPage {...{ postlist }} />
      </div>
    )
  }
}

export default Home
