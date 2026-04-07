import React from 'react'
import { EditOutlined, DeleteOutlined, GlobalOutlined } from '@ant-design/icons'
import { Avatar, Card, Popconfirm } from 'antd'
import type { CardMetaProps, CardProps } from 'antd'
import { createStyles } from 'antd-style'
import type { MenuInfo } from '@/types/index'

const { Meta } = Card

const useStyles = createStyles(({ token }) => ({
  root: {
    width: '100%',
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: `1px solid ${token.colorBorderSecondary}`
  },
  header: {
    borderBottom: 'none',
    paddingBottom: 8
  },
  body: {
    paddingTop: 0
  }
}))

const stylesCard: CardProps['styles'] = {
  root: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderRadius: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 500
  }
}

export const MenuItem: React.FC<{
  menu: MenuInfo
  menus: Array<MenuInfo>
  setMenus: (menus: Array<MenuInfo>) => void
  onEdit: () => void
}> = ({ menu, menus, setMenus, onEdit }) => {
  const { styles: classNames } = useStyles()

  const deleteMenu = (): void => {
    const newMenus = menus.filter((item) => item.id !== menu.id)
    setMenus(newMenus)
  }

  // 新窗口打开链接
  const openNewWindow = (menu: MenuInfo): void => {
    window.api.openUrlWindow({ url: menu.path, isTop: menu.isTop })
  }

  const actions = [
    <GlobalOutlined key="link" onClick={() => openNewWindow(menu)} style={{ color: '#45b7d1' }} />,
    <EditOutlined key="edit" onClick={onEdit} style={{ color: '#45b7d1' }} />,
    <Popconfirm
      key="delete"
      title="提示"
      description="确认删除吗？"
      onConfirm={() => deleteMenu()}
      okText="确认"
      cancelText="取消"
    >
      <DeleteOutlined style={{ color: '#ff6b6b' }} />
    </Popconfirm>
  ]

  const sharedCardProps: CardProps = {
    classNames,
    actions
  }

  const sharedCardMetaProps: CardMetaProps = {
    avatar: <Avatar src={<img draggable={false} src={menu.icon} alt="avatar" />} />,
    description: menu.path
  }

  return (
    <>
      {/* {holder} */}
      <Card {...sharedCardProps} styles={stylesCard} variant="borderless">
        <Meta {...sharedCardMetaProps} title={menu.name} />
      </Card>
    </>
  )
}
