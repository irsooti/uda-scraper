const fs = require("fs");
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

/**
 * Lezioni on-line
 */
const scraperType1 = (selector, document, arrayToMutate) => {
  document.querySelectorAll(selector).forEach((e) => {
    const [name] = e.textContent.match(/[^[\]]+(?=])/g);
    const title = e.textContent.split("]")[1].trim().toLowerCase();
    arrayToMutate.push({
      link: e.getAttribute("href"),
      code: name.split(" ")[0].toUpperCase(),
      slug: name.split(" ")[1].toLowerCase(),
      title,
    });
  });
};

const scraperType2 = (selector, document, slug, arrayToMutate) => {
  document.querySelectorAll(selector).forEach((e) => {
    const [code, title] = e.textContent
      .split("-")
      .map((m) => m.trim().toLowerCase());
    arrayToMutate.push({
      link: e.getAttribute("href"),
      code: code.toUpperCase(),
      slug,
      title,
    });
  });
};

const scraperType3 = (selector, document, slug, arrayToMutate) => {
  document.querySelectorAll(selector).forEach((e) => {
    const [title, code] = e.textContent
      .split("-")
      .map((m) => m.trim().toLowerCase());
    arrayToMutate.push({
      link: e.getAttribute("href"),
      code: code.toUpperCase(),
      slug,
      title,
    });
  });
};

const scrape = async () => {
  const html = await fetch("https://zeus.unich.it/teledidattica").then((r) =>
    r.text()
  );

  const {
    window: { document },
  } = new JSDOM(html);
  const items = [];

  scraperType1("#scuolecontent a", document, items);
  scraperType2("#dipcontent a", document, "dipartimenti", items);
  scraperType2("#cdscontent a", document, "corso-di-studio", items);
  scraperType2("#dottcontent a", document, "dottorati", items);
  scraperType3("#d700Mcontent a", document, "architettura", items);
  scraperType3("#dL648body a", document, "assistenza-sanitaria", items);
  scraperType3("#dBASAcontent a", document, "basa", items);
  scraperType3("#dOBC7body a", document, "beni-culturali", items);

  fs.writeFile(
    "myjsonfile.json",
    JSON.stringify(items, null, 4),
    "utf8",
    (err) => {
      console.log(err);
    }
  );
};

scrape();
