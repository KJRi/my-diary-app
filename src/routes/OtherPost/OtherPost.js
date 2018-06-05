// @flow
import React from 'react'
import styles from './OtherPost.css'
import { Card, Carousel, Icon, Avatar, message } from 'antd'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import moment from 'moment'

const { Meta } = Card

type Props = {
  match: Object
}
type State = {
  postlist: Object,
  confirmLoading: Boolean,
  userinfo: Object,
  headerImg: String,
  likeState: Boolean,
  fileList: Array<Object>
}

class OtherPost extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      postlist: {},
      confirmLoading: false,
      userinfo: {},
      likeState: false,
      fileList: [],
      headerImg: ''
    }
  }
  componentWillMount () {
    const id = this.props.match.params.id
    const username = localStorage.getItem('username')
    fetch(`/info/get?username=${username}`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      if (res !== null) {
        this.setState({
          userinfo: res,
          headerImg: res.headerImg
        })
      }
    })
    fetch(`/diary/get?id=${id}`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        postlist: res,
        fileList: res.photo
      })
    })
    fetch(`/like/getBy?id=${id}&&username=${username}`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      if (res.length > 0) {
        this.setState({
          likeState: true
        })
      }
    })
  }
  likeIt = () => {
    const { likeState, postlist } = this.state
    if (likeState) {
      // 取消点赞
      fetch('/like/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          id: this.props.match.params.id
        })
      }).then(res => res.json())
        .then(res => {
          // 后端正确
          if (res.success) {
            message.destroy()
            message.success(res.message)
            this.setState({
              likeState: false
            })
          } else {
            message.destroy()
            message.info(res.message)
          }
        })
        .catch(e => console.log('Oops, error', e))
    } else {
      fetch('/like/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          id: this.props.match.params.id,
          title: postlist.title,
          content: postlist.content,
          postTime: postlist.postTime
        })
      }).then(res => res.json())
        .then(res => {
          // 后端正确
          if (res.success) {
            message.destroy()
            message.success(res.message)
            this.setState({
              likeState: true
            })
          } else {
            message.destroy()
            message.info(res.message)
          }
        })
        .catch(e => console.log('Oops, error', e))
    }
  }

  render () {
    const { postlist, fileList, headerImg, likeState } = this.state
    return (
      <div>
        <Card
          cover={<Carousel autoplay>
            {
            fileList && fileList.map((item, index) =>
              <div key={index}><img src={item.thumbUrl} /></div>
            )
          }
          </Carousel>
          }
  >
          <Meta
            avatar={
              <div style={{ textAlign: 'center' }}>
                <Avatar src={headerImg} />
                <h5 style={{ color: '#999' }}>{postlist.author}</h5>
              </div>
          }
            title={postlist.title}
            description={
              <div>
                <p>{moment(postlist.postTime).format('lll')}</p>
                <p><Icon type='cloud'
                  style={{ color: '#7BBFEA' }} />
                  {postlist.weather} | <Icon
                    type='environment'
                    style={{ color: '#FFE600' }} />
                  {postlist.location}
                </p>
              </div>}
            style={{ marginBottom: 10 }}
    />
          <p dangerouslySetInnerHTML={{ __html:postlist.content }} />
        </Card>
      </div>
    )
  }
}

export default withRouter(OtherPost)
