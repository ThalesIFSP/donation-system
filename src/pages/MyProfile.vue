<template>
  <q-form ref="editForm" @submit="handleSignIn" class="row">
    <q-card
      v-if="!!formError && !emailError && !passwordError"
      class="bg-red text-white q-my-md shadow-0"
    >
      <q-card-section>
        <q-icon name="warning" color="white" class="q-mr-sm" />

        {{ dig(formError, ["error", "message"]) || dig(formError, ["error"]) }}
      </q-card-section>
    </q-card>

    <h4 class="q-ma-lg">Conta</h4>

    <!-- Line 1 Nome -->
    <div class="row col-12">
      <div class="col-5 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Nome Completo</span>
        <q-input
          placeholder="Nome"
          class="poppins fnt-size-18"
          v-model="name"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
        />
      </div>
      <div class="col-5 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">CPF</span>
        <q-input
          readonly
          placeholder="XXXX.XXX.XXX/XXX-XX"
          class="poppins fnt-size-18"
          v-model="cpf"
          lazy-rules
        />
      </div>
    </div>

    <!-- Line 2 EMAIL -->
    <div class="row col-12">
      <div class="col-5 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">E-mail</span>
        <q-input
          placeholder="example@email.com"
          class="poppins fnt-size-18"
          v-model="email"
          lazy-rules
          aria-autocomplete="email"
          readonly
        />
      </div>

      <div class="col-5 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Senha</span>

        <q-input
          placeholder="Senha"
          class="poppins fnt-size-18"
          v-model="password"
          type="text"
          lazy-rules
          aria-autocomplete="password"
          disable="true"
        >
          <template v-slot:append>
            <q-icon
              :name="passwordVisible ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="passwordVisible = !passwordVisible"
            />
          </template>
        </q-input>
      </div>
    </div>

    <h4 class="q-ma-lg">Endereço</h4>

    <!-- Line 3 CEP -->
    <div class="row col-12">
      <div class="col-3 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">CEP</span>
        <q-input
          placeholder="CEP"
          class="poppins fnt-size-18"
          v-model="cep"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
        />
      </div>
      <div class="col-4 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Cidade</span>
        <q-input
          placeholder="Cidade"
          class="poppins fnt-size-18"
          v-model="city"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
        />
      </div>
      <div class="col-1 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">UF</span>
        <q-input
          placeholder="SP"
          class="poppins fnt-size-18"
          v-model="uf"
          lazy-rules
        />
      </div>
    </div>

    <!-- Line 4 Rua -->
    <div class="row col-12">
      <div class="col-4 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Rua</span>
        <q-input
          placeholder="Rua XxxxX Xx XXxxxxxx"
          class="poppins fnt-size-18"
          v-model="street"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
        />
      </div>
      <div class="col-1 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Nº</span>
        <q-input
          placeholder="Número"
          class="poppins fnt-size-18"
          v-model="number"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
        />
      </div>
      <div class="col-4 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Bairro</span>
        <q-input
          placeholder="Bairro São Padrião"
          class="poppins fnt-size-18"
          v-model="district"
          lazy-rules
        />
      </div>
    </div>

    <div class="row col-12">
      <span class="col-3"></span>
      <q-btn
        :loading="handlingEdit"
        color="primary"
        @click="handleEditInfo(3)"
        class="poppins text-h4 col-4"
        no-caps
      >
        Editar
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Editando...
        </template>
      </q-btn>
    </div>
  </q-form>
</template>

<script>
import { api } from "src/boot/axios";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ProfilePage",
  data() {
    const handlingEdit = ref(false);

    return {
      // Loading variables
      passwordVisible: false,
      handlingEdit,

      // Form variables
      name: null,
      cpf: "555.555.555-55",
      cep: null,
      city: null,
      uf: null,
      street: null,
      number: null,
      district: null,
      complement: null,
      email: null,
      password: null,
      userData: null,

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

  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);

    api
      .get("/api/user/" + user.idt, {
        auth: { username: "thalesinfoifsp@gmail.com", password: "thaleslindo" },
      })
      .then((res) => {
        const data = res.data;
        this.userData = data;
        this.name = data.name;
        this.cpf = data.document;
        this.email = data.email;
        this.password = "*********************";

        this.cep = data.address.cep;
        this.city = data.address.city;
        this.uf = data.address.state;
        this.street = data.address.street;
        this.number = data.address.number;
        this.district = data.address.district;
        this.complement = data.address.complement;
      });
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
    handleEditInfo() {
      this.$refs.editForm.validate(false).then((valid) => {
        if (valid) {
          this.handlingEdit = true;
          const user = JSON.parse(localStorage.getItem("user"));

          const newUser = {
            address: {
              cep: this.cep,
              city: this.city,
              state: this.uf,
              street: this.street,
              number: this.number,
              district: this.district,
              complement: this.complement,
            },
            device: this.userData.device,
            document: this.userData.document,
            email: this.userData.email,
            name: this.name,
            phone: this.userData.phone,
            sendEmail: this.userData.sendEmail,
            sendWhatsApp: this.userData.sendWhatsApp,
            idt: this.userData.idt,
            moderatorId: this.userData.moderatorId,
          };

          api
            .put(`/api/user/${user.idt}`, newUser, {
              auth: {
                username: "thalesinfoifsp@gmail.com",
                password: "thaleslindo",
              },
            })
            .then(() => {
              alert("Dados atualizados!");
              localStorage.setItem("user", JSON.stringify(newUser));
            });
          this.formError = null;

          this.handlingEdit = false;
        } else {
        }
      });
    },
  },
});
</script>
