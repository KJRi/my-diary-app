// @flow
import React from 'react'
import './AllPeople.css'
import { Input } from 'antd'
import OtherPage from 'components/OtherPage'
const Search = Input.Search

type Props = {}
type State = {
  postlist: Array<Object>
}

class AllPeople extends React.PureComponent<Props, State> {
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
    fetch(`/diary/all?title=${evalue}`, {
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
    fetch('/diary/all', {
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
          placeholder='请输入您想搜索的日记'
          onSearch={this.searchPst}
          size='large'
        />
        <OtherPage {...{ postlist }} />
      </div>
    )
  }
}

export default AllPeople
