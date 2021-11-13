import { Icon, message, Modal, Upload } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface';
import React from 'react'
import { IResponseData, IResponseError } from '../services/CommonTypes';

interface IImgUploaderProps {
    value?: string
    onChange?: (imgUrl: string) => void;
}
interface IImgState {
    showModal: boolean
}
export default class extends React.Component<IImgUploaderProps, IImgState> {
    state: IImgState = {
        showModal: false
    }
    private getUploadContent() {
        if (this.props.value) {
            return null;
        } else {
            return (
                <div >
                    <Icon type="plus" />
                    <div>点击上传</div>
                </div>
            )
        }
    }
    private getFileList(): UploadFile[] {
        if (this.props.value) {
            return [
                {
                    uid: this.props.value,
                    name: this.props.value,
                    url: this.props.value
                }
            ]
        }
        return []
    }
    // handleChange(info) {
    //     // console.log(info)
    //     // 有坑
    // }
    /**
     * 需要手动编写处理函数
     * @param p 
     */
    async handleRequest(p: any) {
        // console.log(p)
        let formData = new FormData()
        formData.append(p.filename, p.file)// 键 值
        // fetchapi
        const request = new Request(p.action, {
            method: "post",
            body: formData
        })
        const resp: IResponseData<string> | IResponseError = await fetch(request).then(resp => resp.json())
        // console.log(resp)
        if (resp.err) {
            // 有错误
            message.error('上传失败')
        } else {
            // 触发回调
            if (this.props.onChange) {
                this.props.onChange(resp.data!)// !:去掉null
            }
        }

    }
    render() {
        return (
            <div>
                <Upload
                    action="/api/upload"
                    name="imgfile"// 要和后端键名相匹配
                    accept=".jpg,.png,.gif"
                    listType="picture-card"
                    fileList={this.getFileList()}
                    customRequest={this.handleRequest.bind(this)}
                    // onChange={this.handleChange.bind(this)}
                    onRemove={() => {
                        if (this.props.onChange) {
                            this.props.onChange("")
                        }
                    }}
                    onPreview={() => {
                        this.setState({
                            showModal: true
                        })
                    }}
                >
                    {this.getUploadContent()}
                </Upload>
                <Modal
                    visible={this.state.showModal}
                    footer={null}
                    onCancel={() => {
                        this.setState({
                            showModal: false
                        })
                    }}
                >
                    <img alt="" style={{ width: '100%' }} src={this.props.value} />
                </Modal>
            </div>
        )
    }
}
