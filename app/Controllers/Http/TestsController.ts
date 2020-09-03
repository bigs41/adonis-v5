import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import help from 'App/Utils/Helpers'

export default class TestsController {
    public async index ({request}:HttpContextContract) {
        let data = [
            {id:1,parent:0},
            {id:2,parent:1},
            {id:3,parent:1},
            {id:4,parent:1},
            {id:5,parent:2},
            {id:6,parent:2},
        ]
        data = help.buildTree(data,{
                idKey: 'id',
                parentKey: 'parent',
                childrenKey: 'children{{id}}_{{parent}}'
        })
        // console.log('children{{id}}{{id}}'.match(/(?<={{).*?(?=}})/g));
        
        return data
    }
}
