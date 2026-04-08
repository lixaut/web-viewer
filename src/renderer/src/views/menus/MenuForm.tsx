import { Modal, Form, Input, Button, message, Switch } from 'antd'
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

  const handleCancel = (): void => {
    form.resetFields()
    onVisibleChange(false)
  }

  const handleSubmit = (values: MenuInfo): void => {
    let newValues: Array<MenuInfo> = []
    newValues = [
      ...menus,
      {
        ...values,
        id: crypto.randomUUID(),
        icon: `https://logos.hunter.io/${new URL(values.path).hostname}`
      }
      // { ...values, id: crypto.randomUUID(), icon: values.path + '/favicon.ico' }
    ]
    if (pageType === PageType.EDIT) {
      const menu = form.getFieldsValue()
      newValues = [
        ...menus.filter((item) => item.id !== id),
        { ...menus.find((item) => item.id === id), ...menu }
      ]
    }
    console.log(newValues)
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
      console.log(menu)
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
          <Form.Item<MenuInfo> label="是否置顶" name="isTop">
            <Switch defaultChecked onChange={(state) => form.setFieldValue('isTop', state)} />
          </Form.Item>
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
