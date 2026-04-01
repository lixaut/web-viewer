import { FloatButton, Modal, Form, Input, Button, message } from 'antd'
import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import type { MenuInfo } from '@/types'

interface CreateMenuProps {
  setMenus: (menus: Array<MenuInfo>) => void
  menus: Array<MenuInfo>
}

function CreateMenu({ setMenus, menus }: CreateMenuProps): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const [form] = Form.useForm()

  const handleCancel = (): void => {
    form.resetFields()
    setIsModalOpen(false)
  }

  const handleSubmit = (values: MenuInfo): void => {
    const newValues = [
      ...menus,
      { ...values, id: crypto.randomUUID(), icon: values.path + '/favicon.ico' }
    ]
    setMenus(newValues)
    setIsModalOpen(false)
    messageApi.success('新增成功')
  }

  return (
    <>
      {contextHolder}
      <FloatButton icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} />
      <Modal title="新增菜单" open={isModalOpen} footer={null} onCancel={handleCancel}>
        <Form form={form} layout="vertical" autoComplete="off" onFinish={handleSubmit}>
          <Form.Item<MenuInfo>
            label="名称"
            name="name"
            rules={[{ required: true, message: '该项不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<MenuInfo>
            label="路径"
            name="path"
            rules={[{ required: true, message: '该项不能为空' }]}
          >
            <Input />
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

export default CreateMenu
