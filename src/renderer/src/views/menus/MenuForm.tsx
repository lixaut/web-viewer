import { Modal, Form, Input, Button, message, InputNumber, Divider, Switch, Row, Col } from 'antd'
import { type MenuInfo, PageType } from '@/types'
import { useEffect } from 'react'

interface MenuFormProps {
  setMenus: (menus: Array<MenuInfo>) => void
  menus: Array<MenuInfo>
  visible: boolean
  pageType: PageType
  id?: string | number
  onVisibleChange: (visible: boolean) => void
}

function MenuForm({
  setMenus,
  menus,
  visible,
  id,
  pageType,
  onVisibleChange
}: MenuFormProps): React.JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  // 取消操作
  const handleCancel = (): void => {
    form.resetFields()
    onVisibleChange(false)
  }

  // 提交操作
  const handleSubmit = (values: MenuInfo): void => {
    let newValues: Array<MenuInfo> = []
    const newItem = {
      name: values.name,
      path: values.path,
      windowConfig: {
        width: values.windowConfig?.width || 900,
        height: values.windowConfig?.height || 670,
        alwaysOnTop: values.windowConfig?.alwaysOnTop || false,
        center: values.windowConfig?.center,
        x: values.windowConfig?.center ? undefined : values.windowConfig?.x,
        y: values.windowConfig?.center ? undefined : values.windowConfig?.y
      },
      id: crypto.randomUUID(),
      icon: `https://logos.hunter.io/${new URL(values.path).hostname}`
    }
    newValues = [...menus, newItem]
    if (pageType === PageType.EDIT) {
      newValues = [
        ...menus.filter((item) => item.id !== id),
        {
          ...menus.find((item) => item.id === id),
          name: newItem.name,
          path: newItem.path,
          windowConfig: newItem.windowConfig
        } as MenuInfo
      ]
    }
    if (!Array.isArray(newValues)) {
      messageApi.warning('数据格式错误')
      return
    }
    setMenus(newValues)
    onVisibleChange(false)
    messageApi.success(`${pageType}成功`)
  }

  // 在组件加载后设置初始值（比如编辑场景）
  useEffect(() => {
    if (pageType === PageType.EDIT && id) {
      const menu = menus.find((menu) => menu.id === id)
      // 模拟异步获取数据后，更新表单字段
      form.setFieldsValue({
        ...menu
      })
    }
  }, [pageType, id, visible])

  return (
    <>
      {contextHolder}
      <Modal title={`${pageType}菜单`} open={visible} footer={null} onCancel={handleCancel}>
        <Form form={form} layout="vertical" autoComplete="off" onFinish={handleSubmit}>
          <Form.Item<MenuInfo>
            label="名称"
            name="name"
            rules={[{ required: true, message: '该项不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<MenuInfo>
            label="url"
            name="path"
            rules={[{ required: true, message: '该项不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Divider>窗口配置</Divider>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item<MenuInfo>
                label="窗口宽度"
                labelAlign="left"
                name={['windowConfig', 'width']}
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <InputNumber min={500} max={2000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<MenuInfo>
                label="窗口高度"
                labelAlign="left"
                name={['windowConfig', 'height']}
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <InputNumber min={300} max={2000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item<MenuInfo>
                label="窗口居上"
                labelAlign="left"
                name={['windowConfig', 'x']}
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <InputNumber min={0} max={2000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<MenuInfo>
                label="窗口居左"
                labelAlign="left"
                name={['windowConfig', 'y']}
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <InputNumber min={0} max={2000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item<MenuInfo>
                label="窗口居中"
                labelAlign="left"
                name={['windowConfig', 'center']}
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<MenuInfo>
                label="窗口置顶"
                labelAlign="left"
                name={['windowConfig', 'alwaysOnTop']}
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default MenuForm
