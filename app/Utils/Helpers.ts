import _ from 'lodash'
import collect from 'collect.js'
import moment from 'moment'
export default {
    /** 
     * เช็คข้อมูลหรือตัวแปร ว่า empty
     * @param {String} mixed_var ข้อมูลหรือตัวแปรที่ต้องการเช็ค
    **/
    empty (mixed_var){
        if (!mixed_var || mixed_var == '0') {
          return true;
        }
        if (typeof mixed_var == 'object') {
          for (var k in mixed_var) {
            return false;
          }
          return true;
        }
        return false;
    },
    /** 
     * เช็คข้อมูลหรือตัวแปร ว่า empty
     * @param {Object} items ข้อมูล
     * @param {String} key ชื่อคีย์
     * @param {default} defaultData default return
    **/
    get (items, key, defaultData=undefined){
        return !this.empty(_.get(items, key)) ? _.get(items, key, defaultData) : defaultData;
    },
    /** Usage:
    * @example
    * helper.buildTree(Array, {
    *       idKey: 'id',
    *       parentKey: 'parent',
    *       childrenKey: 'children'
    * })
    */
    buildTree (data, options) {
        options = options || {};
        var ID_KEY = options.idKey || 'id';
        var PARENT_KEY = options.parentKey || 'parent';
        var CHILDREN_KEY = options.childrenKey || 'children';
        var matchs = CHILDREN_KEY.match(/(?<={{).*?(?=}})/g)
        var matchs_space = CHILDREN_KEY.match(/(?<=}}).*?(?={{)/g) || ''
        var tree = [],
          childrenOf = {};
        var item, id, parentId;
        if(!this.empty(matchs)){
            CHILDREN_KEY = CHILDREN_KEY.replace(/{{(.*?)}}/g,'')
            CHILDREN_KEY = CHILDREN_KEY.replace(matchs_space,'')
        }
        for (var i = 0, length = data.length; i < length; i++) {
          item = data[i];
          id = item[ID_KEY];
          parentId = item[PARENT_KEY] || 0;
          // ทุกรายการอาจมีลูก
          childrenOf[id] = childrenOf[id] || [];
          // ริเริ่มเด็ก ๆ
          if(!this.empty(matchs)){
              let $matchs = matchs.map(r=>{
                  return item[r]
              }).join(matchs_space)
              
              item[`${CHILDREN_KEY}${$matchs}`] = childrenOf[id];
          }else{
            item[`${CHILDREN_KEY}`] = childrenOf[id];
          }
          if (parentId != 0) {
            // init its parent's children object
            childrenOf[parentId] = childrenOf[parentId] || [];
            // push it into its parent's children object
            childrenOf[parentId].push(item);
          } else {
            tree.push(item);
          }
        };
        return tree;
      }
}