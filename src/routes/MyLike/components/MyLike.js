// @flow
import React from 'react'
import './MyLike.css'
import PostPage from 'components/PostPage'
import { List, Avatar, Icon } from 'antd'

type Props = {}
type State = {
  likelist: Array<Object>,
  postlist: Array<Object>
}

class MyLike extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      likelist: [],
      postlist: []
    }
  }
  componentWillMount () {
    const username = localStorage.getItem('username')
    fetch(`/like/getByUser?username=${username}`, {
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
    const { postlist } = this.state
    return (
      <div>
        <PostPage {...{ postlist }} />
      </div>
    )
  }
}

export default MyLike
