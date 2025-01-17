"use client";
import lodash from "lodash";
import { useTranslation } from "react-i18next";
import { toBrix, calcSb } from "@/lib/utils/unitConverter";
import { NutrientType } from "@/types/nutrientTypes";
import { Recipe } from "@/types/recipeDataTypes";
function RecipeView({
  nutrientData,
  recipeData,
}: {
  nutrientData: NutrientType;
  recipeData: Recipe;
}) {
  const recipeName = "";
  const {
    selected,
    inputs,
    goFerm,
    goFermType,
    yeastAmount,
    nutrientAdditions,
    remainingYan,
    otherNutrientName,
  } = nutrientData;
  const {
    units,
    ingredients,
    additives,
    notes,
    volume,
    OG,
    FG,
    ABV,
    delle,
    sorbate,
    sulfite,
    campden,
    addingStabilizers,
  } = recipeData;

  const nuteNames = [
    "g Fermaid O",
    "g Fermaid K",
    "g DAP",
    `g ${otherNutrientName.value}`,
  ];

  const { t } = useTranslation();
  const isMetric = units?.weight === "kg" || units?.volume === "liter";
  function toC(num?: number) {
    if (!num) return "";
    return isMetric ? Math.round((num - 32) * (5 / 9)) : num;
  }
  const lowTemp = toC(parseFloat(selected.yeastDetails.low_temp));
  const highTemp = toC(parseFloat(selected?.yeastDetails.high_temp));
  const tempString = `${t("PDF.tempRange")} ${lowTemp}-${highTemp}°${
    isMetric ? "C" : "F"
  }`;

  const primary = ingredients.filter(
    (item) => !item.secondary && parseFloat(item.details[0]) > 0
  );
  const secondary =
    ingredients?.filter(
      (item) => item.secondary && parseFloat(item.details[0]) > 0
    ) || [];
  const filteredAdditives =
    additives?.filter((item) => {
      return parseFloat(item.amount) > 0 && item.name.length > 0;
    }) || [];

  const secondaryNotesExist =
    notes.secondary.length > 0 &&
    (notes.secondary[0][0].length > 0 || notes.secondary[0][1].length > 0);

  const showPageTwo =
    secondary.length > 0 || secondaryNotesExist || filteredAdditives.length > 0;

  return (
    <div className="pdf-page">
      <div className="page-one">
        <header>
          <img src="/pdf-logo.png" />

          <h1>{recipeName ? recipeName : t("PDF.pageTitle")}</h1>
        </header>
        <section>
          <table>
            <thead>
              <tr>
                <td>{t("PDF.totalVolume")}</td>
                <td> {t("PDF.yeast")}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>
                    {volume} {units && units.volume}
                  </p>
                  <p>
                    {goFerm.amount > 0 &&
                      `${goFerm.amount}g ${goFermType.value || "Go-Ferm"} ${t(
                        "PDF.with"
                      )} ${goFerm.water}ml ${t("water")}`}
                  </p>
                </td>
                <td>
                  <p>
                    {`${yeastAmount}g ${t("PDF.of")} ${
                      selected?.yeastBrand !== "Other"
                        ? selected?.yeastBrand
                        : ""
                    } ${selected?.yeastDetails.name}`}
                  </p>
                  <p>{tempString}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <table>
            <thead>
              <tr>
                <td>{t("PDF.estimatedOG")}</td>
                <td>{t("PDF.estimatedFG")}</td>
                <td>{t("PDF.tolerance")}</td>
                <td>{t("PDF.expectedABV")}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>{OG.toFixed(3)}</p>
                  <p>{toBrix(OG).toFixed(2)}</p>
                </td>
                <td>
                  <p>{parseFloat(FG).toFixed(3)}</p>
                  <p>{`${toBrix(parseFloat(FG)).toFixed(3)} ${t("BRIX")}`}</p>
                </td>
                <td>
                  <p>{`${selected?.yeastDetails.tolerance}%`}</p>
                  <p>
                    {OG !== undefined
                      ? `${t("PDF.sugarBreak")} ${calcSb(OG).toFixed(3)}`
                      : ""}
                  </p>
                </td>
                <td>
                  <p>{ABV.toFixed(2)}%</p>
                  <p>
                    {delle.toFixed()} {t("DU")}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <td> {t("PDF.nutrient")}</td>
                <td>{t("PDF.numberOfAdditions")}</td>
                <td> {t("PDF.amount")}</td>
                <td> {t("PDF.total")}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t(`nuteSchedules.${selected?.schedule}`)}</td>
                <td>{inputs.numberOfAdditions.value}</td>
                <td>
                  {nutrientAdditions.perAddition.map((nute, i) =>
                    nute > 0 ? (
                      <p key={`nute ${i}`}>
                        {nute.toFixed(3)}
                        {nuteNames[i]}
                      </p>
                    ) : null
                  )}
                </td>
                <td>
                  {nutrientAdditions.totalGrams.map((nute, i) =>
                    nute > 0 ? (
                      <p key={`nute ${i}`}>
                        {nute.toFixed(3)}
                        {nuteNames[i]}
                      </p>
                    ) : null
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <table>
            <thead>
              <tr>
                {addingStabilizers && <td>{t("PDF.stabilizers")}</td>}

                <td>{t("PDF.remaining")}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                {addingStabilizers && (
                  <td>
                    <p>
                      {`${sulfite.toFixed(3)}g ${t("PDF.kmeta")} ${t(
                        "accountPage.or"
                      )} ${campden.toFixed(3)}
                        } ${t("campden")}`}
                    </p>
                    <p>{`${sorbate.toFixed(3)}g ${t("PDF.ksorb")}`}</p>
                  </td>
                )}
                <td>{`${remainingYan}PPM`}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <td>{t("PDF.primary")}</td>
                <td>
                  {t("PDF.weight")} {units.weight}
                </td>
                <td>
                  {t("PDF.volume")} {units.volume}
                </td>
              </tr>
            </thead>
            <tbody>
              {primary?.map((item, i) => (
                <tr key={item.name + i}>
                  <td>
                    {i + 1}. {t(`${lodash.camelCase(item.name)}`)}
                  </td>
                  <td>{item.details[0]}</td>
                  <td>{item.details[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section style={{ pageBreakAfter: "always" }}>
          {notes.primary.length > 0 && notes.primary[0][0].length > 0 && (
            <table>
              <thead>
                <tr>
                  <td>{t("PDF.primaryNotes")}</td>
                  <td> {t("PDF.details")}</td>
                </tr>
              </thead>
              <tbody>
                {notes.primary.map((note, i) => {
                  return (
                    <tr key={"primary note #" + i}>
                      <td>
                        {i + 1}. {note[0]}
                      </td>
                      <td>{note[1]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
      {showPageTwo && (
        <div className="page-two">
          <div className="img-container">
            <img src="/pdf-logo.png" />
          </div>
          <section className="secondary-section">
            {secondary.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <td>{t("PDF.secondary")}</td>
                    <td>
                      {t("PDF.weight")} {units.weight}
                    </td>
                    <td>
                      {t("PDF.volume")} {units.volume}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {secondary.map((item, i) => (
                    <tr key={item.name + i}>
                      <td>
                        {i + 1}. {t(`${lodash.camelCase(item.name)}`)}
                      </td>
                      <td>{item.details[0]}</td>
                      <td>{item.details[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          {filteredAdditives.length > 0 && (
            <section>
              <table>
                <thead>
                  <tr>
                    <td>Additives</td>

                    <td>Amount</td>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdditives?.map((item, i) => (
                    <tr key={"additive " + i}>
                      <td>
                        {i + 1}. {item.name}
                      </td>
                      <td>
                        {`${item.amount} ${
                          item.unit !== "units" ? item.unit : ""
                        }`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {secondaryNotesExist && (
            <table>
              <thead>
                <tr>
                  <td>{t("PDF.secondaryNotes")}</td>
                  <td> {t("PDF.details")}</td>
                </tr>
              </thead>
              <tbody>
                {notes.secondary.map((note, i) => {
                  return (
                    <tr key={"secondary note #" + i}>
                      <td>
                        {i + 1}. {note[0]}
                      </td>
                      <td>{note[1]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeView;
