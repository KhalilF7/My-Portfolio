export default{
    name:'members',
    title:'Members',
    type: 'document',
    fields:[
        {
            name:'name',
            title:'Name',
            type:'string'
        },
        {
            name:'project',
            title:'Project',
            type:'string'
        },
        {
            name:'role',
            title:'Role',
            type:'string'
        },
        {
            name:'photo',
            title:'Photo',
            type: 'image',
            options: {
              hotspot: true,
            },
        },
    ]
}