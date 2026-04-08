import Menus from './views/menus'
import { ConfigProvider, theme } from 'antd'

function App(): React.JSX.Element {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <Menus />
    </ConfigProvider>
  )
}

export default App
