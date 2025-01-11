//router
// import IndexRouters from "./router/index"

//scss
import "./assets/scss/hope-ui.scss"
import "./assets/scss/custom.scss"
import "./assets/scss/dark.scss"
import "./assets/scss/rtl.scss"
import "./assets/scss/customizer.scss"
import "./index.css"

// Redux Selector / Action
import { useDispatch } from 'react-redux';

// import state selectors
import { setSetting } from './store/setting/actions'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App({ children }) {
  const dispatch = useDispatch()
  dispatch(setSetting())
  return (
    <div className="App">
      {/* <IndexRouters /> */}
      {children}
      <ToastContainer />
    </div>
  );
}

export default App;
