<script setup>

import Utils from "../config/utils.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tutorials = ref([]);
const user = Utils.getStore("user");
const text = ref("There are four main categories of accommodations here at OC! The categories for accommodations are Chapel, Meal plan, Academic, and Housing.");
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title
          >Hello, {{ user.fName }} {{ user.lName }}!</v-toolbar-title
        >
      </v-toolbar>
      <br /><br />
      <v-card>
        
        <v-card-title> Accommodations Background </v-card-title>
          <v-card-text>
          <b>{{ text }}</b>
        </v-card-text>
        <v-expansion-panels>
  <v-expansion-panel
    title="Chapel"
    text="Chapel accommodations happen for different reasons for students here on campus. The following are reasons to get reductions or dismissals from required chapel. Health issues/personal safety allows for reductions. Off-campus living allows for reductions. If a student has classes all day and has no time to fit in lunch they then all able to gain reductions and accommodations. "
  >
  </v-expansion-panel>
</v-expansion-panels>

<v-expansion-panels>
  <v-expansion-panel
    title="Meal Plan"
    text="For the first few years living on campus students are required to have a meal plan so that they always have a source of food and water. However a student can change your meal plan and make accommodations to it. A student can change the amount of meals they have at the on campus dining hall which can make the cost lower or higher. Once students reach the point of being able to live in an on campus apartment then they can change the amount of meals needed due to now having a kitchen readily available to them. However students can change the amount of meals they have due to allergies. "
  >
  </v-expansion-panel>
</v-expansion-panels>

<v-expansion-panels>
  <v-expansion-panel
    title="Academic"
    text="For academic accommodations there are different ways ways to get approval for accommodation. Some students with disabilities or diagnosis that requires extra help or time can be given extra exam time with approval from professor. For physical diabilities having a note taker can be an accommodation can be allowed. Under the same scenario as note taking, a student can have a helper for technology use such as laptops or tablets. For hearing disabilities or for students with a different native language, an interpreter can be given with approval.For students with stress, depression, and/or anxiety an Emotional Support Animal (ESA) may be allowed within academic buildings and classes."
  >
  </v-expansion-panel>
</v-expansion-panels>

<v-expansion-panels>
  <v-expansion-panel
    title="Housing"
    text="Students with disabilities have first access to ground floor rooms and where they are located. Students with disabilities can request a private room that is ground floor and is close to the entrance/exit. With permission from the University and doctors note, a student can have an Emotional Support Animal (ESA) or service animal within their living space and around campus. Students with depression, anxiety, stress and/or illnesses can be approved for an animal to help them through the day. Students can request private rooms if the student is not comfortable sharing a room with another student or because of a disability.  "
  >
  </v-expansion-panel>
</v-expansion-panels>
      </v-card>
    </v-container>
  </div>
</template>