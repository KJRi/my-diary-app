// @flow
import React from 'react'
import styles from './ImageWallUpload.css'
import { Upload, Icon, message, Modal } from 'antd'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

type Props = {
  getImage: Function,
  fileList: Array<Object>
}
type State = {
  previewVisible: Boolean,
  previewImage: '',
}

class ImageWallUpload extends React.PureComponent<Props, State> {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.fileList
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    })
  }
  handleChange = ({ fileList }) => {
    this.setState({
      fileList
    }, this.props.getImage(fileList))
  }
  render () {
    const { previewVisible, previewImage } = this.state
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>Upload</div>
      </div>
    )
    return (
      <div className='clearfix'>
        <Upload
          listType='picture-card'
          fileList={this.props.fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default ImageWallUpload
