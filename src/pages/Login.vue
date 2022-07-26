<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#4161d3, #fff)"
  >
    <div id="sign-in">
      <q-card
        square
        class="shadow-24 q-pr-lg q-pl-lg"
        style="width: 520px; height: 540px"
      >
        <img
          alt="Sem desperdício sem fome logo."
          src="~assets/logoRetangulo.png"
          style="width: 500px; height: 250px"
        />
        <p class="text-grey-8 poppins fnt-size-16">
          Insira suas credenciais para acessar o portal.
        </p>

        <q-form ref="signInForm" @submit="handleSignIn">
          <q-card
            v-if="!!formError && !emailError && !passwordError"
            class="bg-red text-white q-my-md shadow-0"
          >
            <q-card-section>
              <q-icon name="warning" color="white" class="q-mr-sm" />

              {{
                dig(formError, ["error", "message"]) ||
                dig(formError, ["error"])
              }}
            </q-card-section>
          </q-card>

          <q-input
            placeholder="E-mail"
            class="poppins fnt-size-16"
            v-model="email"
            :rules="formRules.email"
            :error="!!emailError"
            :error-message="emailError"
            lazy-rules
            aria-autocomplete="email"
          />

          <q-input
            placeholder="Senha"
            class="poppins fnt-size-16"
            v-model="password"
            :type="passwordVisible ? 'text' : 'password'"
            :rules="formRules.password"
            :error="!!passwordError"
            :error-message="passwordError"
            lazy-rules
            aria-autocomplete="password"
          >
            <template v-slot:append>
              <q-icon
                :name="passwordVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="passwordVisible = !passwordVisible"
              />
            </template>
          </q-input>

          <q-btn
            label="Entrar"
            type="submit"
            flat
            dense
            no-caps
            class="full-width btn-signin text-bold q-mb-md q-mt-sm poppins fnt-size-20"
            :loading="handlingSignIn"
            push
          />
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { api } from "src/boot/axios";
import { Cookies } from "quasar";

export default {
  name: "LoginPage",

  data() {
    return {
      // Loading variables

      passwordVisible: false,

      handlingSignIn: false,

      // Form variables

      email: null,

      password: null,

      formRules: this.parseFormRules([
        {
          field: "email",

          name: "E-mail",

          required: true,

          extraRules: [
            (v) =>
              !v ||
              /.+@.+/.test(v) ||
              (!!v && v.length == 0) ||
              "Endereço de e-mail inválido",
          ],
        },

        {
          field: "password",

          name: "Senha",

          required: true,
        },
      ]),

      // Error variables

      formError: null,
    };
  },

  computed: {
    emailError() {
      if (this.formError) {
        let error = this.formError?.error;

        return error && error?.attribute == "email"
          ? error.full_message || error.message
          : null;
      } else {
        return null;
      }
    },

    passwordError() {
      if (this.formError) {
        let error = this.formError?.error;

        return error && error?.attribute == "password"
          ? error.full_message || error.message
          : null;
      } else {
        return null;
      }
    },
  },

  methods: {
    handleSignIn() {
      this.$refs.signInForm.validate(false).then((valid) => {
        if (valid) {
          this.formError = null;

          this.handlingSignIn = true;
          api
            .post("/api/user/login", {
              email: this.email,
              pass: this.password,
            })
            .then((res) => {
              localStorage.setItem("user", JSON.stringify(res.data));

              this.$router.push({ name: "home" });
            })
            .catch((err) => {
              this.handlingSignIn = false;
              console.log(err, "<--ERR");
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.btn-signin {
  background-color: #4161d3;

  border: solid 1px #4161d3;
  border-radius: 40px;
  color: white;
}

.btn-recovery-password {
  background-color: transparent;

  border: none;

  color: black;

  font-weight: normal;

  text-decoration: underline;

  padding: 0px;
}

.q-btn .q-focus-helper {
  display: none;
}

:deep(.q-btn.btn--no-hover .q-focus-helper) {
  display: none;
}
</style>
