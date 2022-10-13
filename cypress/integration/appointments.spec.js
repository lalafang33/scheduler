describe("appointment", ()=> {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
  
    cy.visit("/");
  
    cy.contains("Monday");
   });
    it("should book an interview", () => {
      

      cy.get("[alt=Add]")
       .first()
       .click();
    
      cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
      cy.get('[alt="Sylvia Palmer"]').click();
    
      cy.contains("Save").click();
    
      cy.contains(".appointment__card--show", "Lydia Miller-Jones");
      cy.contains(".appointment__card--show", "Sylvia Palmer");
  })
  it("should Edit an interview", () => {


    cy.get(".appointment__actions-button")
      .invoke('show') // call jquery method 'show' on the '.container'
    cy.get("[alt=Edit]").click();

    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Edit Version")
      .get('[alt="Tori Malcolm"]').click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Edit Version");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });


  it("should Cancel an interview", () => {
    cy.get(".appointment__actions-button")
      .invoke('show') // call jquery method 'show' on the '.container'
    cy.get("[alt=Delete]").click();

    cy.get(".appointment__card--confirm")
     .contains(".button--danger", "Confirm")
     .click();

     cy.contains("Deleting").should("exist");
     cy.contains("Deleting").should("not.exist");
   
     cy.contains(".appointment__card--show", "Archie Cohen")
       .should("not.exist");


  });
})