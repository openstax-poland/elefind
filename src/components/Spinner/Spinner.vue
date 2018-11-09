<template>
    <div v-if="isLoading" class="loader-holder">
        <div class="loader"></div>
    </div>
</template>

<script>
export default {
    props:{
        isLoading: false
    }
}
</script>

<style lang="scss" scoped>
.loader-holder{
    display: flex;
    justify-content: center;
    .loader {
        opacity: 1;
        border: 10px solid transparent;
        border-radius: 50%;
        border-top: 10px solid #3498db;
        border-bottom: 10px solid #2ECC71;
        width: 80px;
        height: 80px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
    }
}

/* Safari */
@-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>


