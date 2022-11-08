export default ({ app }) => {
  app.mixin({
    data() {
      return { title: "" };
    },
    computed: {},
    methods: {
      parseFormRules(rules) {
        let newRules = rules.reduce((acc, val) => {
          let rules = [];

          if (val.required) {
            rules.push(
              (v) =>
                !!v || [false, 0].includes(v) || `${val.name} é obrigatório`
            );
          }

          if (val.extraRules) {
            val.extraRules.forEach((rule) => rules.push(rule));
          }

          if (rules.length > 0) {
            if (val.namespace) {
              this.assignRecursive(acc, val.namespace, val.field, rules);
            } else {
              acc[val.field] = rules;
            }
          }
          return acc;
        }, {});
        return newRules;
      },

      errorFromField(formError, attribute) {
        if (formError) {
          let error = formError?.error;

          if (error && error?.attribute == attribute) {
            return !!error.attribute_human && !!error.message
              ? [error.attribute_human, error.message].join(" ")
              : error.full_message || error.message;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },

      scrollToFirstFieldWithError(ref, scrollContainer = window) {
        let y;

        if (scrollContainer == window) {
          y =
            ref.$el.getBoundingClientRect().top +
            (scrollContainer.pageYOffset || 0) -
            80 -
            100;
        } else {
          y = ref.$el.offsetTop - 80;
        }

        scrollContainer.scrollTo({
          top: y,

          behavior: "smooth",
        });

        return;
      },
    },
  });
};
