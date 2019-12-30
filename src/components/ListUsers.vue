<template>
  <div>
    <h1>Users()</h1>

    <table cleass="table table-bordered table-hover">
      <thead>
        <tr>
          <th>entityHash</th>
          <th>entityType</th>
          <th>entityName</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.entityHash">
        <td>{{ user.entityHash }}</td>
        <td>{{ user.entityType }}</td>
        <td>{{ user.entityName }}</td>
        </tr>
      </tbody>

    </table>

  </div>
</template>

<script>
import {APIService} from '@/APIService.js';
const apiService = new APIService();

export default {
  name: 'ListUsers',

  data(){
    return {
      users: [],
      numOfUsers: 0,
    };
  },
  methods: {
    getUsers(){
      apiService.getUsers().then((data) => {
        console.log(data.data);
        this.users = data.data;
      });
    },
  },
  mounted() {
    this.getUsers();
  }
}
</script>