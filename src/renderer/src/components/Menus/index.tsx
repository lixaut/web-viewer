import styles from './index.module.css'
import { useState } from 'react'
import MenuItem from './MenuItem'
import { Row, Col } from 'antd'

function Menus(): React.JSX.Element {
  const [menus, setMenus] = useState<MenuItem[]>([
    {
      id: crypto.randomUUID(),
      icon: 'https://www.baidu.com/favicon.ico',
      name: '百度',
      url: 'https://www.baidu.com'
    },
    {
      id: crypto.randomUUID(),
      icon: 'https://www.taobao.com/favicon.ico',
      name: '淘宝',
      url: 'https://www.taobao.com'
    }
  ])
  return (
    <>
      <div className={styles.container}>
        <Row gutter={12}>
          {menus.map((menu) => (
            <Col span={6} key={menu.id}>
              <MenuItem info={menu} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  )
}

export default Menus
