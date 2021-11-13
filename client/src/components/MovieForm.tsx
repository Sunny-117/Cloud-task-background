import { Button, Form, Input, InputNumber, message, Switch } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React from 'react'
import { IMovie } from '../services/MovieService';
import ImgUploader from './ImgUploader';
import { Checkbox } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { RouteComponentProps, withRouter } from 'react-router';

interface IFormProp extends RouteComponentProps<any> {
    form: WrappedFormUtils<any>
    onSubmit: (movie: IMovie) => Promise<string>//成功还是失败
    movie?: IMovie// 处理修改电影
}

const formItemLayout = {
    // 让文本框和文本在同一行
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 19,
        offset: 1
    }

}
const AllAreas: { label: string, value: string }[] = [
    { label: '中国大陆', value: "中国大陆" },
    { label: '美国', value: "美国" },
    { label: '中国台湾', value: "中国台湾" },
    { label: '中国香港', value: "中国香港" }
]
const AreaGroups = Checkbox.Group

const AllTypes: { label: string, value: string }[] = [
    { label: '喜剧', value: "喜剧" },
    { label: '灾难', value: "灾难" },
    { label: '爱情', value: "爱情" },
    { label: '动作', value: "动作" }
]
const TypeGroups = Checkbox.Group


class MovieForm extends React.Component<IFormProp> {
    private handleSubmit(e: React.FormEvent<any>) {
        e.preventDefault()
        // 获取表单数据
        this.props.form.validateFields(async errors => {
            // console.log(errors)
            if (!errors) {
                const formData = this.props.form.getFieldsValue()
                console.log(formData)// 获取到属性名是name。why？因为getFieldDecorator
                // 抛出事件让外部处理
                const result = await this.props.onSubmit(formData as IMovie)
                if (result) {
                    message.error(result)
                } else {
                    message.success('处理成功', 1, () => {
                        // 跳转页面
                        // this.props.history 没有history
                        // 这时候需要withRouter高阶函数,并且用RouteComponentProps声明一下
                        // 但是这时候AddMovie有报错了，报错说没有传递以下属性: history, location, match
                        // 原因是export default Form.create<IFormProp>()(withRouter(MovieForm));的时候，IFormProp不知道有
                        // withRouter包装，简单解决方案是withRouter包装在外面
                        this.props.history.push('/movie')

                    })
                }
            }
        })

    }
    render() {
        // console.log(this.props)//没有类型检查，需要加上IFormProp接口
        // this.props.form.
        // 处理第三方库的类型检查能力
        const { getFieldDecorator } = this.props.form;
        return <Form onSubmit={this.handleSubmit.bind(this)} {...formItemLayout} style={{ width: "400px" }}>
            <Form.Item label="电影名称"
            >

                {/* {getFieldDecorator(配置)(
                    <Input />
                )} */}
                {getFieldDecorator<IMovie>("name", {
                    // 第二个参数配置验证表单规则
                    rules: [{
                        required: true,
                        message: '请填写电影名称'
                    }]
                })(
                    <Input />
                    // Input会被高阶组件所控制
                )}
            </Form.Item>
            <Form.Item label="封面图"
            >
                {getFieldDecorator<IMovie>("poster", {})(
                    <ImgUploader />
                    // 这里报错，因为需要传递一个value属性，这里我明确知道getFieldDecorator会给ImgUploader注入value属性，所以不用传递
                    // 如果是需要传别的属性，需要额外配置
                )}
            </Form.Item>
            <Form.Item label="地区"
            >
                {getFieldDecorator<IMovie>("areas", {
                    rules: [{
                        required: true,
                        message: '请选择地区'
                    }]
                })(
                    <AreaGroups options={AllAreas} />
                )}
            </Form.Item>
            <Form.Item label="类型"
            >
                {getFieldDecorator<IMovie>("types", {
                    rules: [{
                        required: true,
                        message: '请选择类型'
                    }]
                })(
                    <TypeGroups options={AllTypes} />
                )}
            </Form.Item>
            <Form.Item label="时长(分钟)"
            >
                {getFieldDecorator<IMovie>("timeLong", {
                    rules: [{
                        required: true,
                        message: '请填写时长'
                    }]
                })(
                    <InputNumber min={1} step={10} />
                )}
            </Form.Item>
            <Form.Item label="正在热映"
            >
                {getFieldDecorator<IMovie>("isHot", { initialValue: false, valuePropName: "checked" })(
                    <Switch />
                )}
            </Form.Item>
            <Form.Item label="即将上映"
            >
                {getFieldDecorator<IMovie>("isComing", { initialValue: false, valuePropName: "checked" })(
                    <Switch />
                )}
            </Form.Item>
            <Form.Item label="经典影片"
            >
                {getFieldDecorator<IMovie>("isClassic", {
                    initialValue: false
                    // anti有个坑，没有填，直接提交，没有填写的数据为undefined，必须改动之后才有值
                    // 解决：赋一个初始默认值
                    // getFieldDecorator-f12-第二个参数f12->initialValue初始值
                    // 可见，ts的方便
                    , valuePropName: "checked"
                })(
                    <Switch />
                )}
            </Form.Item>
            <Form.Item label="描述"
            >
                {getFieldDecorator<IMovie>("description", {})(
                    <TextArea />
                )}
            </Form.Item>
            <Form.Item
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 19, offset: 5 }}
            >
                <Button type="primary" htmlType="submit">提交</Button>
                {/* htmlType="submit"表示表单提交功能按钮才能真正触发提交事件 */}
            </Form.Item>
        </Form>
    }
}



type MovieField = {
    // [P in keyof IMovie]: any
    // 这里如果我想去掉_id呢
    [P in Exclude<keyof IMovie, "_id">]: any

}
function getDefaultField(movie: IMovie): MovieField {
    // 回顾类型验算
    // {
    //     name:string
    //     types:string[]
    // }
    // ---->
    // {
    //     name:any
    //     types:any
    // }
    const obj: any = {}
    for (const key in movie) {
        obj[key] = Form.createFormField({
            value: movie[key]
        })
    }
    return obj;
}
export default withRouter(Form.create<IFormProp>(

    {
        mapPropsToFields: props => {
            if (props.movie) {
                // 有值，说明做编辑
                // return {
                // 表单的数据回填
                // name: Form.createFormField({
                //     // value: 'asd'
                //     value: props.movie.name
                //     // 接下来体力活，我来简化他
                //     // 写个函数，帮我生成这个对象
                // })
                // }
                return getDefaultField(props.movie)
            }
            // 没值，说明做添加

        }
    }
)((MovieForm)));
// 小bug：
// 把值设置到组件上，设置的是value属性
// 但是Switch的组件没有value属性，所以编辑的时候默认值会变化
// switch组件应该是checked属性