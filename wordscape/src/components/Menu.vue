<template>
    <div class="menu-overlay">
        <div class="menu-buttons">
            <v-btn elevation="10" size="large" @click="$emit('start-game')" color="custom-yellow" class="custom-menu-button">PLAY</v-btn>
            <v-btn elevation="10" size="large" @click="$emit('open-settings')" color="custom-yellow" class="custom-menu-button">SETTINGS</v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Menu',
    created() {
        this.$vuetify.theme.themes.light.colors['custom-yellow'] = '#f3e304'
    }
}
</script>

<style scoped>
.menu-overlay {
    position: absolute;
    top: 20%;
    width: 70%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(247, 172, 11);
    z-index: 10;
}

.menu-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    
}

.custom-menu-button {
    font-size: 24px !important;
    cursor: pointer !important;
    border-radius: 5px !important;
    margin: 10px 0 !important;
    width: 200px !important;
    text-align: center !important;
}

.custom-menu-button:hover {
    background-color: #1fcd28 !important;
}

.custom-menu-button:hover .v-btn__content {
    color: black !important;
}
</style>