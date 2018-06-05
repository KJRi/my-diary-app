// @flow
import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import styles from './Footer.css'

type Props = {
  location: Location
}

type State = {
  current: string

}

class Footer extends React.Component<Props, State> {
  props: Props
  handleClick: (e: Object) => void

  activeMenuItem: Function

  constructor (props: Props) {
    super(props)

    this.state = { current: '-1' }

    this.handleClick = this.handleClick.bind(this)
    this.activeMenuItem = this.activeMenuItem.bind(this)
  }

  componentWillMount () {
    const { location } = this.props
    this.activeMenuItem(location)
  }

  componentWillReceiveProps (nextProps: Props) {
    const { location } = nextProps
    this.activeMenuItem(location)
  }

  handleClick (e: Object) {
    console.log(e)
    this.setState({ current: e.key })
  }

  activeMenuItem (location: Location) {
    const username = localStorage.getItem('username')
    const { pathname } = location
    let key
    switch (pathname) {
      case '/':
        key = 'allPeople'
        break
      case '/home':
        key = 'home'
        break
      case '/detail':
        key = 'detail'
        break
      case `/editPost`:
        key = 'editPost'
        break
      case '/personal':
        key = 'personal'
        break
      // default:
      //   key = 'home'
    }
    this.setState({ current: key })
  }

  render () {
    const username = localStorage.getItem('username')
    return (
      <footer className={styles['footer']}>
        <Menu
          mode='horizontal'
          onclick={this.handleClick}
          selectedKeys={[this.state.current]}
          defaultSelectedKeys={['1']}
          className={styles['footer-menu']}
        >
          <Menu.Item key='allPeople'><Link to='/'><Icon type='home' />首页</Link></Menu.Item>
          <Menu.Item key='home'><Link to='/home'><Icon type='book' />我的日记</Link></Menu.Item>
          <Menu.Item key='detail'><Link to='/detail'><Icon type='dashboard' />时间轴</Link></Menu.Item>
          <Menu.Item key='editPost'><Link to='/editPost'><Icon type='edit' />写日记</Link></Menu.Item>
          <Menu.Item key='personal'><Link to='/personal'><Icon type='user' />个人中心</Link></Menu.Item>
        </Menu>
      </footer>
    )
  }
}

export default withRouter(Footer)
