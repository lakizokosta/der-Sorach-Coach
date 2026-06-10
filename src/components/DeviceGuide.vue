<script setup>
/**
 * Short explainer: activate code once, use same e-mail on other devices.
 */

defineProps({
  /** `buy` | `basis` = checkout steps; `landing` = second device; `compact` = one line */
  variant: {
    type: String,
    default: 'buy',
    validator: (v) => ['buy', 'basis', 'landing', 'compact'].includes(v),
  },
});
</script>

<template>
  <div
    class="device-guide"
    :class="{
      'device-guide--landing': variant === 'landing',
      'device-guide--compact': variant === 'compact',
    }"
  >
    <template v-if="variant === 'buy' || variant === 'basis'">
      <div class="device-guide__title">📱 So funktioniert's auf allen Geräten</div>
      <ol class="device-guide__steps">
        <li>
          <strong>Bezahlen</strong> — du bekommst den Code per E-Mail.
        </li>
        <li>
          <strong>Erstes Gerät</strong> (Computer/Tablet): E-Mail öffnen und
          <strong>«Jetzt aktivieren»</strong> antippen.
        </li>
        <li>
          <strong>Handy &amp; weitere Geräte</strong>: Auf der
          <router-link :to="{ name: 'landing' }">Startseite</router-link>
          dieselbe E-Mail eingeben → <strong>«Link senden»</strong>.
          <em>Kein Code nötig</em> —
          <template v-if="variant === 'basis'">kein Zeitlimit &amp; Fortschritt sind sofort da.</template>
          <template v-else>Premium &amp; Fortschritt sind sofort da.</template>
        </li>
      </ol>
    </template>

    <template v-else-if="variant === 'landing'">
      <div class="device-guide__title">📱 Neues Gerät (Handy, Tablet, …)?</div>
      <p class="device-guide__text">
        Schon auf dem Computer aktiviert? Hier nur <strong>dieselbe E-Mail</strong>
        eingeben und «Link senden» — Premium ist sofort da.
        <strong>Kein Code nötig.</strong>
      </p>
    </template>

    <p v-else class="device-guide__text">
      Weitere Geräte: Auf der
      <router-link :to="{ name: 'landing' }">Startseite</router-link>
      mit derselben E-Mail einloggen — kein Code nötig.
    </p>
  </div>
</template>
