<template>
    <div>
        <h1>Professor Rating App</h1>
        <AddEntry id="addEntry" @entryAdded="addEntry"></AddEntry>
        <ListEntries
            id="listEntry"
            v-for="(singleEntry, index) of listOfEntries"
            :key="index"
            :entry="singleEntry"
            :index="index"
            @entryRemoved="removeEntry"
            @entryEdited="editEntry"
        ></ListEntries>
    </div>
</template>

<script>
import AddEntry from "./components/AddEntry.vue";
import ListEntries from "./components/ListEntries.vue";
import axios from "axios";

export default {
    name: "App",
    components: {
        AddEntry,
        ListEntries,
    },
    data: function () {
        return {
            listOfEntries: [],
        };
    },
    methods: {
        addEntry: function (e) {
            axios
                .post("http://localhost:8080/profs/", {
                    name: e.name,
                    rating: e.rating,
                })
                .then((response) => {
                    this.listOfEntries.push(response.data);
                });
        },
        removeEntry: function (index) {
            axios
                .delete(
                    "http://localhost:8080/profs/" +
                        this.listOfEntries[Object.values(index)]._id
                )
                .then((response) => {
                    this.listOfEntries.splice(Object.values(index), 1);
                });
        },
        editEntry: function (index) {
            axios
                .put(
                    "http://localhost:8080/profs/" +
                        this.listOfEntries[index["index"]]._id,
                    {
                        name: this.listOfEntries[index["index"]].name,
                        rating: this.listOfEntries[index["index"]].rating,
                    }
                )
                .then((response) => {
                    this.listOfEntries[index["index"]] = response.data;
                });
        },
    },
    mounted() {
        axios.get("http://localhost:8080/profs/").then((response) => {
            this.listOfEntries = response.data;
        });
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding: 60px;
    width: 700px;
    margin-left: auto;
    margin-right: auto;
    background-color: lightblue;
}
#addEntry,
h1 {
    margin-bottom: 40px;
}
</style>
