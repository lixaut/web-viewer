import styles from './index.module.css'
import { MenuItem } from './MenuItem'
import { Row, Col } from 'antd'
import CreateMenu from './CreateMenu'
import { useElectronStore } from '@renderer/hooks/useElectronStore'

function Menus(): React.JSX.Element {
  const { value: menus, setValue: setMenus } = useElectronStore('menus', [
    {
      id: crypto.randomUUID(),
      icon: 'https://www.baidu.com/favicon.ico',
      name: '百度',
      path: 'https://www.baidu.com'
    }
  ])
  return (
    <>
      <div className={styles.container}>
        <Row gutter={10}>
          {menus.map((menu) => (
            <Col span={8} key={menu.id}>
              <MenuItem menu={menu} menus={menus} setMenus={setMenus} />
            </Col>
          ))}
        </Row>
        <CreateMenu setMenus={setMenus} menus={menus} />
      </div>
    </>
  )
}

export default Menus
