<template>

</template>
<script>
    import {api} from '../js/api/api.js';
    export default ({
        data () {
            return {

            }
        },
        mounted () {
            this.getlist()
        },
        methods:{
            getlist () {
                let param={
                    "rows":10,
                    "page":1,
                    "sort":"sid",
                    "order":"asc"
                }
                api.cc(param).then((val)=>{
                    console.log(val)
                })
            }
        }
    })
</script>
