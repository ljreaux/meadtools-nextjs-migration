import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Recipe } from "@/types/recipeDataTypes";

type TextAreaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function Notes({ useRecipe }: { useRecipe: () => Recipe }) {
  const { t } = useTranslation();
  const {
    notes,
    editPrimaryNote,
    editSecondaryNote,
    removePrimaryNote,
    removeSecondaryNote,
    addPrimaryNote,
    addSecondaryNote,
  } = useRecipe();
  return (
    <div>
      <div className="joyride-notesCard py-6">
        <h2>{t("notes.subtitleOne")}</h2>

        {notes.primary.length > 0 ? (
          <>
            {notes.primary.map((note, i) => {
              return (
                <Note
                  key={i + "PrimaryNote"}
                  number={i + 1}
                  remove={() => removePrimaryNote(i)}
                  noteProps={{
                    value: note[0],
                    onChange: (e) => editPrimaryNote.text(i, e.target.value),
                  }}
                  detailProps={{
                    value: note[1],
                    onChange: (e) => editPrimaryNote.details(i, e.target.value),
                  }}
                />
              );
            })}
          </>
        ) : (
          <p className="py-6">Press the button below to add a Note.</p>
        )}
        <Button
          onClick={addPrimaryNote}
          disabled={notes.primary.length >= 10}
          variant="secondary"
        >
          New Note
        </Button>
      </div>
      <div className="py-6">
        <h2>{t("notes.subtitleTwo")}</h2>
        {notes.secondary.length > 0 ? (
          <>
            {notes.secondary.map((note, i) => {
              return (
                <Note
                  key={i + "SecondaryNote"}
                  number={i + 1}
                  remove={() => removeSecondaryNote(i)}
                  noteProps={{
                    value: note[0],
                    onChange: (e) => editSecondaryNote.text(i, e.target.value),
                  }}
                  detailProps={{
                    value: note[1],
                    onChange: (e) =>
                      editSecondaryNote.details(i, e.target.value),
                  }}
                />
              );
            })}
          </>
        ) : (
          <p className="py-6">Press the button below to add a Note.</p>
        )}
        <Button
          onClick={addSecondaryNote}
          disabled={notes.secondary.length >= 10}
          variant="secondary"
        >
          New Note
        </Button>
      </div>
    </div>
  );
}

export default Notes;

const Note = ({
  noteProps,
  detailProps,
  number,
  remove,
}: {
  noteProps: TextAreaProps;
  detailProps: TextAreaProps;
  remove: () => void;
  number: number;
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid sm:grid-cols-12 grid-cols-6 gap-4 py-4 relative items-center">
      <p className="absolute -left-6 top-4">{number}.</p>
      <label className="sm:col-span-5 col-span-full">
        Note
        <Textarea {...noteProps} placeholder={t("notes.placeholder")} />
      </label>
      <label className="sm:col-span-4 col-span-full">
        Details
        <Textarea {...detailProps} placeholder={t("notes.placeholder")} />
      </label>
      <Button
        onClick={remove}
        variant="destructive"
        className="sm:col-span-2 col-span-full"
      >
        Remove
      </Button>
    </div>
  );
};
