// @flow
import React from 'react'
import styles from './Detail.css'
import { DatePicker, Timeline } from 'antd'
import moment from 'moment'
const { RangePicker } = DatePicker

type Props = {}
type State = {
  postlist: Array<Object>
}

class Detail extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      postlist: []
    }
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
  changeDate = (date, dateString) => {
    const username = localStorage.getItem('username')
    console.log(date, dateString)
    fetch(`/diary/get?timeOne=${dateString[0]}&&timeTwo=${dateString[1]}&&author=${username}`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      this.setState({
        postlist: res
      })
    })
  }
  enterPost = (item: Object) => {
    window.location.href = `/id/${item._id}`
  }
  render () {
    const postlist = this.state.postlist
    const timeline = postlist && postlist.map((item, index) => {
      return <Timeline.Item
        onClick={() => this.enterPost(item)}
        key={index}><p>{item.title}</p>{moment(item.postTime).format('lll')}</Timeline.Item>
    })
    return (
      <div className={styles['detail-contain']}>
        <RangePicker onChange={this.changeDate} />
        <div className={styles['time-contain']}>
          <Timeline>
            {timeline}
          </Timeline>
        </div>
      </div>
    )
  }
}

export default Detail
