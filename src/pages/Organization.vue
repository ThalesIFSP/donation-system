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

    <h4 class="q-ma-lg">Instituição</h4>

    <!-- Line 1 Imagem Principal -->
    <div class="row col-12">
      <div class="col-3 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Imagem</span>
        <q-file
          color="#4161d3"
          outlined
          v-model="img"
          label="Banner 700x350 pixels"
          @update:model-value="(val) => updateImg(val)"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
      <div class="col-7 q-ma-lg q-px-lg">
        <img
          alt="Banner image."
          :src="imgUrl"
          style="width: 700px; height: 350px"
        />
      </div>
    </div>

    <!-- Line 1 Logo -->
    <div class="row col-12">
      <div class="col-3 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Logo</span>
        <q-file
          color="#4161d3"
          outlined
          v-model="logo"
          label="Logo 150x150 pixels"
          @update:model-value="(val) => updateLogo(val)"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
      <div class="col-7 q-ma-lg q-px-lg">
        <img
          alt="Logo image."
          :src="logoUrl"
          style="width: 250px; height: 250px"
        />
      </div>
    </div>

    <!-- Line 1 Nome -->
    <div class="row col-12">
      <div class="col-7 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Nome da Instituição</span>
        <q-input
          placeholder="Nome"
          class="poppins fnt-size-18"
          v-model="name"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
        />
      </div>
    </div>

    <!-- Line 2 EMAIL -->
    <div class="row col-12">
      <div class="col-11 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Descrição</span>
        <q-input
          type="textarea"
          placeholder="Descrição da instituição"
          class="poppins fnt-size-18"
          v-model="description"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
          outlined
        />
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

    <!-- Line 5 Botão Editar -->
    <div class="row col-12 q-mb-xl">
      <span class="col-3"></span>
      <q-btn
        :loading="handlingEdit"
        color="primary"
        @click="handleEditInfo()"
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
  name: "OrganizationPage",
  data() {
    const handlingEdit = ref(false);

    return {
      // Loading variables
      passwordVisible: false,
      handlingEdit,

      //Charity variables
      idCharity: null,
      moderatorCanEdit: null,
      // Form variables
      name: null,
      description: null,
      file: null,
      groupName: null,
      cep: null,
      city: null,
      uf: null,
      street: null,
      number: null,
      district: null,
      complement: null,

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
    api
      .get("/api/moderator/" + user.moderatorId, {
        auth: { username: "thalesinfoifsp@gmail.com", password: "thaleslindo" },
      })
      .then((res) => {
        const data = res.data;
        this.moderatorCanEdit = data.canEdit;
        this.description = data.charity.desc;
        this.name = data.charity.name;
        this.groupName = data.charity.groupName;

        this.cep = data.charity.address.cep;
        this.city = data.charity.address.city;
        this.uf = data.charity.address.state;
        this.street = data.charity.address.street;
        this.number = data.charity.address.number;
        this.district = data.charity.address.district;
        this.complement = data.charity.address.complement;
        this.idCharity = data.charity.idt;

        api
          .get(`/api/charity/${data.charity.idt}/img`, {
            auth: {
              username: "thalesinfoifsp@gmail.com",
              password: "thaleslindo",
            },
          })
          .then((res) => {
            const data = res.data;
            let imageFile = this.dataURLtoFile(
              "data:image/png;base64," + data.img,
              "img.png"
            );

            let logoFile = this.dataURLtoFile(
              "data:image/png;base64," + data.logo,
              "logo.png"
            );
            this.img = imageFile;
            this.logo = logoFile;
            this.updateImg();
            this.updateLogo();
          });
      });
  },

  setup() {
    const logo = ref(null);
    const logoUrl = ref("");
    const img = ref(null);
    const imgUrl = ref("");

    return {
      logo,
      logoUrl,
      img,
      imgUrl,

      updateLogo(val) {
        logoUrl.value = URL.createObjectURL(logo.value);
      },
      updateImg(val) {
        imgUrl.value = URL.createObjectURL(img.value);
      },
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
    handleEditInfo() {
      if (!this.moderatorCanEdit) {
        alert("Você não tem permissão para editar.");
        return;
      }

      this.$refs.editForm.validate(false).then((valid) => {
        if (valid) {
          const user = JSON.parse(localStorage.getItem("user"));
          this.handlingEdit = true;
          //Salva informações
          api.put(
            `/api/charity/${this.idCharity}?idtModerator=${user.moderatorId}`,
            {
              address: {
                cep: this.cep,
                city: this.city,
                complement: "",
                district: this.district,
                number: this.number,
                state: this.uf,
                street: this.street,
              },
              desc: this.description,
              groupName: this.groupName,
              name: this.name,
            },
            {
              auth: {
                username: "thalesinfoifsp@gmail.com",
                password: "thaleslindo",
              },
            }
          );

          //Salvar logo
          const logoFormData = new FormData();

          logoFormData.append("file", this.logo);

          api.put(
            `/api/charity/{id}/change-logo?idt=${this.idCharity}`,
            logoFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              auth: {
                username: "thalesinfoifsp@gmail.com",
                password: "thaleslindo",
              },
              transformRequest: (formData) => formData,
            }
          );

          const imgFormData = new FormData();

          imgFormData.append("file", this.img);

          api.put(
            `/api/charity/{id}/change-img?idt=${this.idCharity}`,
            imgFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              auth: {
                username: "thalesinfoifsp@gmail.com",
                password: "thaleslindo",
              },
              transformRequest: (formData) => formData,
            }
          );
          alert("Os dados foram atualizados!");

          this.formError = null;
          this.handlingEdit = false;
        } else {
        }
      });
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },
  },
});
</script>
