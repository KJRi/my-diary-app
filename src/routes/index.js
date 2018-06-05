// @flow
// We only need to import the modules necessary for initial render
import Home from './Home'
import Personal from './Personal'
import Detail from './Detail'
import Login from './Login'
import Register from './Register'
import EditPost from './EditPost'
import EditUserInfo from './EditUserInfo'
import Post from './Post'
import OtherPost from './OtherPost'
import MyLike from './MyLike'
import AllPeople from './AllPeople'

// Force import during development to enable Hot-Module Replacement
// not need ?

export default {
  otherPost: OtherPost,
  allPeople: AllPeople,
  myLike: MyLike,
  post: Post,
  editUserInfo: EditUserInfo,
  register: Register,
  editPost: EditPost,
  login: Login,
  home: Home,
  personal: Personal,
  detail: Detail
}
