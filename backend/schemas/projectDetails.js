export default{
    name:'projectDetails',
    title:'Project Details',
    type: 'document',
    fields:[
        {
            name:'title',
            title:'Title',
            type:'string'
        },
        {
            name:'description',
            title:'Description',
            type:'string'
        },
        {
            name:'role',
            title:'Role',
            type:'string'
        },
        {
            name:'technologies',
            title:'Technologies',
            type:'array',
            of:[{ type:'skills'}]
        },
        {
            name:'members',
            title:'Members',
            type:'array',
            of:[{ type:'members'}]
        },
        {
            name:'results',
            title:'Results',
            type:'array',
            of:[{ type:'projectResults'}]
        },
    ]
}