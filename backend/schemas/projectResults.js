export default{
    name:'projectResults',
    title:'Project Results',
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
            name:'results',
            title:'Results',
            type:'image',
            options: {
              hotspot: true,
            },
        },
    ]
}