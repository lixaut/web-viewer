import styles from './index.module.css'
import { MenuItem } from './MenuItem'
import { Row, Col, FloatButton } from 'antd'
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { PageType } from '@/types'
import MenuForm from './MenuForm'
import { useElectronStore } from '@renderer/hooks/useElectronStore'

function Menus(): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false)
  const [pageType, setPageType] = useState(PageType.CREATE)
  const [menuId, setMenuId] = useState<string | number | undefined>(undefined)
  const [btnsVisible, setBtnsVisible] = useState(false)
  const { value: menus, setValue: setMenus } = useElectronStore('menus', [
    {
      id: crypto.randomUUID(),
      icon: 'https://www.baidu.com/favicon.ico',
      name: '百度',
      path: 'https://www.baidu.com'
    }
  ])

  const handleVisibleChange = (visible: boolean): void => {
    setModalVisible(visible)
  }

  const handleOpen = (options: { pageType: PageType; id?: string | number }): void => {
    setPageType(options.pageType)
    setMenuId(options.id || undefined)
    setModalVisible(true)
  }

  return (
    <>
      <div className={styles.container}>
        <Row gutter={[10, 10]}>
          {menus.map((menu) => (
            <Col span={8} key={menu.id}>
              <MenuItem
                menu={menu}
                menus={menus}
                setMenus={setMenus}
                onEdit={() => handleOpen({ pageType: PageType.EDIT, id: menu.id })}
              />
            </Col>
          ))}
        </Row>
        <MenuForm
          setMenus={setMenus}
          menus={menus}
          visible={modalVisible}
          pageType={pageType}
          id={menuId}
          onVisibleChange={handleVisibleChange}
        />
        <FloatButton.Group
          open={btnsVisible}
          trigger="click"
          style={{ insetInlineEnd: 24 }}
          icon={<UnorderedListOutlined />}
          onClick={() => setBtnsVisible(!btnsVisible)}
        >
          <FloatButton
            icon={<PlusOutlined />}
            tooltip="新增"
            onClick={() => handleOpen({ pageType: PageType.CREATE })}
          />
        </FloatButton.Group>
      </div>
    </>
  )
}

export default Menus
