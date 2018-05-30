// @flow
import React from 'react'
import styles from './PersonalList.css'
import { Avatar, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

type Props = {
  history: Object
}
type State = {
  userinfo: Object
}

class PersonalList extends React.PureComponent<Props, State> {
  logout: Function
  constructor (props: Props) {
    super(props)
    this.state = {
      userinfo: {}
    }
  }
  componentWillMount () {
    const username = localStorage.getItem('username')
    if (!username) {
      window.location.href = '/login'
    }
    fetch(`/info/get?username=${username}`, {
      method: 'GET'
    }).then(res => res.json())
    .then(res => this.setState({
      userinfo: res
    }))
  }
  logout () {
    localStorage.clear()
    window.location.href = '/login'
  }
  render () {
    const username = localStorage.getItem('username')
    const { userinfo } = this.state
    return (
      <div>
        <Link to='/editUserInfo'>
          <div className={styles['list-item']}>
            {
          userinfo.headerImg
          ? <Avatar src={userinfo.headerImg} />
          : <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        }
            <h2>{userinfo.username}</h2>
            {
          userinfo.description
          ? <p>{userinfo.description}</p>
          : ''
        }
            {
          userinfo.birthday
          ? <p><Icon type='heart-o' style={{ color: 'red' }} />{userinfo.birthday}</p>
          : ''
        }
            {
          userinfo.location
          ? <p><Icon type='environment' />{userinfo.location[0]}/{userinfo.location[1]}/{userinfo.location[2]}</p>
          : ''
        }
          </div>
        </Link>
        <Link to='/editPost'><div className={styles['list-item']}>
          <Icon type='edit' />写日记<Icon type='right' /></div></Link>
        <Link to='/editUserInfo'><div className={styles['list-item']}>
          <Icon type='solution' />修改信息<Icon type='right' /></div></Link>
        <Link to='/myLike'><div className={styles['list-item']}>
          <Icon type='heart-o' />我的收藏<Icon type='right' /></div></Link>
        <div className={styles['list-item']} onClick={this.logout}><Icon type='logout' />退出登录<Icon type='right' /></div>
      </div>
    )
  }
}

export default withRouter(PersonalList)
