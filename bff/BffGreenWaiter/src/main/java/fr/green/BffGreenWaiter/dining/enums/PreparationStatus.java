package fr.green.BffGreenWaiter.dining.enums;

public enum PreparationStatus {
    READY_TO_BE_SERVED("readyToBeServed"),
    PREPARATION_STARTED("preparationStarted");

    private final String value;

    PreparationStatus(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }

    public static PreparationStatus fromValue(String value) {
        for (PreparationStatus status : values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
