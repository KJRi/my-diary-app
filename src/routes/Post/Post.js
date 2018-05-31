// @flow
import React from 'react'
import styles from './Post.css'
import { Card, Carousel, Icon, Avatar, Modal, Input, message, Button } from 'antd'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import moment from 'moment'
import ImageWallUpload from 'components/ImageWallUpload'

const { Meta } = Card

type Props = {
  match: Object
}
type State = {
  postlist: Object,
  visible: Boolean,
  confirmLoading: Boolean,
  userinfo: Object,
  headerImg: String,
  likeState: Boolean,
  fileList: Array<Object>
}

class Post extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      postlist: {},
      visible: false,
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
      console.log(res)
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
      console.log(res)
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
          } else {
            message.destroy()
            message.info(res.message)
          }
        })
        .catch(e => console.log('Oops, error', e))
      this.setState({
        likeState: false
      })
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
          } else {
            message.destroy()
            message.info(res.message)
          }
        })
        .catch(e => console.log('Oops, error', e))
      this.setState({
        likeState: true
      })
    }
  }
  handleOk = () => {
    const { likeState } = this.state
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
          } else {
            message.destroy()
            message.info(res.message)
          }
        })
        .catch(e => console.log('Oops, error', e))
      this.setState({
        likeState: false
      })
    }
    fetch('/diary/delete', {
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
          window.location.href = '/'
        } else {
          message.destroy()
          message.info(res.message)
        }
      })
      .catch(e => console.log('Oops, error', e))
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  submitPhoto = () => {
    const { fileList } = this.state
    fetch('/diary/addPhoto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        id: this.props.match.params.id,
        imageUrl: fileList
      })
    }).then(res => res.json())
      .then(res => {
        // 后端正确
        if (res.success) {
          message.destroy()
          message.success(res.message)
        } else {
          message.destroy()
          message.info(res.message)
        }
      })
      .catch(e => console.log('Oops, error', e))
  }
  getImage = (fileList: Array<Object>) => {
    this.setState({
      fileList
    })
  }
  render () {
    const { postlist, fileList, headerImg, visible, confirmLoading, likeState, commentList, userinfo } = this.state
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
          actions={[<Icon type={
            likeState
            ? 'heart'
            : 'heart-o'
          } style={{ color: 'red' }} onClick={this.likeIt} />,
            <Icon type='close-circle-o' style={{ color: 'red' }} onClick={() => this.setState({ visible: true })} />]}
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
        <ImageWallUpload getImage={this.getImage} {...{ fileList }} />
        <Button type='primary' onClick={this.submitPhoto}>提交</Button>
        <Modal
          title='确认删除？'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          >
          <p>删除本条日记的全部内容</p>
        </Modal>
      </div>
    )
  }
}

export default withRouter(Post)
