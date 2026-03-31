import React from 'react'
import { EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons'
import { Avatar, Card } from 'antd'
import type { CardMetaProps, CardProps } from 'antd'
import { createStyles } from 'antd-style'

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

const actions = [
  <LinkOutlined key="link" style={{ color: '#45b7d1' }} />,
  <EditOutlined key="edit" style={{ color: '#45b7d1' }} />,
  <DeleteOutlined key="delete" style={{ color: '#ff6b6b' }} />
]

const MenuItem: React.FC<{ info: MenuItem }> = ({ info }) => {
  const { styles: classNames } = useStyles()

  const sharedCardProps: CardProps = {
    classNames,
    actions
  }

  const sharedCardMetaProps: CardMetaProps = {
    avatar: <Avatar src={<img draggable={false} src={info.icon} alt="avatar" />} />,
    description: info.url
  }

  return (
    <Card {...sharedCardProps} styles={stylesCard} variant="borderless">
      <Meta {...sharedCardMetaProps} title={info.name} />
    </Card>
  )
}

export default MenuItem
