/**
 * @fileoverview Shared login modal open state (Landing FAB, Premium Hub FAB, inline buttons).
 */

import { ref } from 'vue';

const showLogin = ref(false);

/** @return {{ showLogin: import('vue').Ref<boolean>, openLogin: Function, closeLogin: Function }} */
export function useLoginModal() {
  function openLogin() {
    showLogin.value = true;
  }

  function closeLogin() {
    showLogin.value = false;
  }

  return { showLogin, openLogin, closeLogin };
}
