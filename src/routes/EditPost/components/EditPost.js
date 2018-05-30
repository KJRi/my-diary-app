// @flow
import React, { Component } from 'react'
import styles from './EditPost.css'
import { Input, Cascader, Form, Icon, Button, message, Select } from 'antd'
import BraftEditor from 'braft-editor'
import ImageWallUpload from 'components/ImageWallUpload'
import data from 'data'
import 'braft-editor/dist/braft.css'
const FormItem = Form.Item
const { Option } = Select
const options = [
  {
    value: '0',
    label: '晴天'
  },
  {
    value: '1',
    label: '多云'
  },
  {
    value: '2',
    label: '阴天'
  },
  {
    value: '3',
    label: '雨天'
  },
  {
    value: '4',
    label: '雨夹雪'
  },
  {
    value: '5',
    label: '下雪'
  },
  {
    value: '6',
    label: '雾霾'
  }
]
type Props = {}
type State = {
  fileList: Array<Object>
}

class EditPost extends React.PureComponent<Props, State> {
  constructor (props) {
    super(props)
    this.state = {
      fileList: []
    }
  }
  handleCancel = () => this.setState({ previewVisible: false })
  // 发日记
  handleSubmit = (e) => {
    e.preventDefault()
    const { fileList } = this.state
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        console.log(fileList)
        fetch('diary/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: localStorage.getItem('username'),
            title: values.title,
            weather: values.weather.label,
            content: values.content,
            location: values.location,
            photo: values.fileList
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
    })
  }
  getImage = (fileList: Array<Object>) => {
    this.setState({
      fileList
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const editorProps = {
      height: 500,
      contentFormat: 'html',
      initialContent: '<p>你的正文</p>',
      onChange: this.handleChange,
      onRawChange: this.handleRawChange
    }
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>Upload</div>
      </div>
    )
    return (
      <div className={styles['containel']}>
        <ImageWallUpload getImage={this.getImage} />
        <Form onSubmit={this.handleSubmit} className={styles.formStyle}>
          <FormItem>
            {getFieldDecorator('weather', {
              rules: [{ required: true, message: '请选择天气!' }]
            })(
              <Select style={{ width: 200 }} labelInValue placeholder='选择天气' >
                {
                  options && options.map((list, index) => {
                    return <Option value={list.value}>{list.label}</Option>
                  })
                }
              </Select>
                      )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('location')(
              <Cascader
                options={data} className={styles['type-item']} placeholder='请选择地点' />
                )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题!' },
            { type: 'string', max:50, message: '标题不能超过50个字符!' }]
            })(
              <Input prefix={<Icon type='edit' style={{ fontSize: 13 }} />} placeholder='你的标题' />
                      )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('content', {
              rules: [{ required: true, message: '请输入正文!' }]
            })(
              <BraftEditor {...editorProps} />
                      )}
          </FormItem>
          <FormItem>
            <Button className={styles.loginButton} type='primary' htmlType='submit'>
              <Icon type='share-alt' style={{ fontSize: 13 }} />发布
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const EditPostForm = Form.create()(EditPost)

export default EditPostForm
